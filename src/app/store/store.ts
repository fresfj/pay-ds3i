import i18n from 'app/store/i18nSlice'
import checkoutApp from 'app/store/checkout'
import apiService from 'app/store/apiService'
import {
  ReducersMapObject,
  configureStore,
  Store,
  combineSlices,
  buildCreateSlice,
  asyncThunkCreator,
  Middleware
} from '@reduxjs/toolkit'
import { createDynamicMiddleware } from '@reduxjs/toolkit/react'
import { AppDispatchType } from 'app/store/types'
import { useDispatch } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createLogger } from 'redux-logger'

/**
 * The dynamic middleware instance.
 */
const dynamicInstance = createDynamicMiddleware()

export const { middleware: dynamicMiddleware } = dynamicInstance

export const addAppMiddleware =
  dynamicInstance.addMiddleware.withTypes<Config>()

const middlewares: Middleware[] = [apiService.middleware, dynamicMiddleware]

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) =>
      logEntry ? !logEntry.error : true
  })
  middlewares.push(logger)
}

/**
 * The type definition for the lazy loaded slices.
 */
export interface LazyLoadedSlices {}

/**
 * The static reducers.
 */
const staticReducers: ReducersMapObject = {
  i18n,
  checkoutApp,
  [apiService.reducerPath]: apiService.reducer
}

/**
 * The root reducer.
 */
export const rootReducer =
  combineSlices(staticReducers).withLazyLoadedSlices<LazyLoadedSlices>()

/**
 * The type definition for the root state.
 */
export type RootState = ReturnType<typeof rootReducer>

/**
 * Configures the app store.
 */
export function configureAppStore(initialState?: RootState) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(middlewares)
  }) as Store<RootState>

  setupListeners(store.dispatch)

  return store
}

/**
 * The type definition for the app store.
 */
export type AppStore = typeof store

/**
 * The type definition for the app dispatch.
 */
export type AppDispatch = AppStore['dispatch']

/**
 * Typed hook to get the dispatch function from the Redux store.
 */
export const useAppDispatch: () => AppDispatchType = useDispatch

/**
 * Shortage for the root state selector.
 */
export const appSelector = rootReducer.selector

/**
 * createAppSlice is a wrapper around createSlice that adds support for asyncThunkCreator.
 */
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
})

/**
 * The type definition for the config object passed to `withAppMiddleware`.
 */
type Config = {
  state: RootState
  dispatch: AppDispatch
}

export const withAppMiddleware =
  dynamicInstance.withMiddleware.withTypes<Config>()

const store = configureAppStore()

export default store
