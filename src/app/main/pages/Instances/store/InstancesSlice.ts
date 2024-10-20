import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { RootStateType } from 'app/store/types'

const STORAGE_KEY = 'whatsApp_instance'
type AppRootStateType = RootStateType<any>

export const getStoredData = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)
    return storedData ? JSON.parse(storedData) : undefined
  } catch (error) {
    console.error('Error getting stored data:', error)
    return undefined
  }
}

const saveDataToStorage = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (error) {
    console.error('Error saving data to storage:', error)
  }
}

const removeDataFromStorage = (key: string) => {
  try {
    const storedData = getStoredData()
    if (storedData && storedData[key]) {
      delete storedData[key]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData))
    }
  } catch (error) {
    console.error('Error removing data from storage:', error)
  }
}

const initialState = {
  getAll: []
}

const instancesSlice = createSlice({
  name: 'instancesApp/instances',
  initialState,
  reducers: {
    setInstance: (state, action) => {
      state.getAll = action.payload
      saveDataToStorage(state)
    },
    addInstance: (state, action) => {
      state.getAll.push(action.payload)
      saveDataToStorage(state)
    },
    removeInstance: (state, action) => {
      state.getAll = state.getAll.filter(
        instance => instance.id !== action.payload
      )
      saveDataToStorage(state)
    },
    resetInstances: state => {
      state.getAll = []
    }
  }
})

export default instancesSlice.reducer

export const { setInstance, addInstance, resetInstances, removeInstance } =
  instancesSlice.actions

export const instanceSelector = state => state.instancesApp.instances?.getAll

export const instancesSelector = (state: AppRootStateType) =>
  state?.instancesApp?.instances?.getAll ?? []

export const instancesCountSelector = createSelector(
  instancesSelector,
  instances => instances.length
)
