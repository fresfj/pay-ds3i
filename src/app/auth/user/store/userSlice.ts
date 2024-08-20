/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import settingsConfig from 'app/configs/settingsConfig'
import { RootStateType } from 'app/store/types'
import { User } from 'src/app/auth/user'
import { PartialDeep } from 'type-fest'
import _ from '@lodash'
import userModel from '../models/UserModel'

type AppRootStateType = RootStateType<userSliceType>

function updateRedirectUrl(user: PartialDeep<User>) {
  /*
    You can redirect the logged-in user to a specific route depending on his role
    */
  if (user?.data?.loginRedirectUrl && user?.data?.loginRedirectUrl !== '') {
    settingsConfig.loginRedirectUrl = user.data.loginRedirectUrl // for example 'apps/academy'
  }
}

/**
 * Sets the user object in the Redux store.
 */
export const setUser = createAsyncThunk<User, User>(
  'user/setUser',
  async user => {
    updateRedirectUrl(user)

    return user
  }
)

/**
 * Reset the user state.
 */
export const resetUser = createAsyncThunk('user/resetUser', async () => {
  return true
})

/**
 * The initial state of the user slice.
 */
const initialState: User = userModel({})

/**
 * The User slice
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Updates the user's settings
     */
    setUserShortcuts: (state, action) => {
      const oldState = _.cloneDeep(state)
      const newUser = _.setIn(
        oldState,
        'data.shortcuts',
        action.payload
      ) as User

      if (_.isEqual(oldState, newUser)) {
        return undefined
      }

      return newUser
    },
    /**
     * Updates the user's settings
     */
    setUserSettings: (state, action) => {
      const oldState = _.cloneDeep(state)
      const newUser = _.setIn(oldState, 'data.settings', action.payload) as User

      if (_.isEqual(oldState, newUser)) {
        return undefined
      }

      return newUser
    },
    /**
     * Updates the user object in the Redux store.
     */
    updateUser: (state, action) => {
      const oldState = _.cloneDeep(state)
      const user = action.payload as PartialDeep<User>
      const newUser = _.merge({}, oldState, user)
      if (_.isEqual(oldState, newUser)) {
        return undefined
      }

      return newUser as User
    },
    userSignOut: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(setUser.fulfilled, (state, action) => {
      const user = action.payload as PartialDeep<User>
      const newUser = _.defaults(user, state)

      if (_.isEqual(state, newUser)) {
        return undefined
      }

      return action.payload
    })
    builder.addCase(resetUser.fulfilled, state => {
      if (!_.isEqual(state, initialState)) {
        return initialState
      }

      return undefined
    })
  }
})

export const { userSignOut, updateUser, setUserShortcuts, setUserSettings } =
  userSlice.actions

export const selectUser = (state: AppRootStateType) => state?.user

export const selectUserRole = (state: AppRootStateType) => state?.user?.role

export const selectIsUserGuest = (state: AppRootStateType) => {
  const userRole = state?.user?.role

  return !userRole || userRole?.length === 0
}

export const selectUserShortcuts = (state: AppRootStateType) =>
  state.user?.data?.shortcuts

export const selectUserSettings = (state: AppRootStateType) =>
  state.user?.data?.settings

export type userSliceType = typeof userSlice

export default userSlice.reducer
