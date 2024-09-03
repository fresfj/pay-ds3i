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

const initialState = getStoredData() || {
  instance: {},
  profile: {},
  contacts: []
}

const instanceSlice = createSlice({
  name: 'whatsApp/instance',
  initialState,
  reducers: {
    setInstanceApp: (state, action) => {
      state.instance = action.payload
      saveDataToStorage(state)
    },
    setProfileApp: (state, action) => {
      state.profile = action.payload
      saveDataToStorage(state)
    },
    setContactsApp: (state, action) => {
      state.contacts = action.payload
      saveDataToStorage(state)
    },
    addContactApp: (state, action) => {
      state.contacts.push(action.payload)
      saveDataToStorage(state)
    },
    removeContactApp: (state, action) => {
      state.contacts = state.contacts.filter(
        contact => contact.id !== action.payload
      )
      saveDataToStorage(state)
    },
    clearDataApp: state => {
      state.instance = {}
      state.profile = {}
      state.contacts = []
      saveDataToStorage(state)
    }
  }
})

export default instanceSlice.reducer

export const {
  setInstanceApp,
  setProfileApp,
  setContactsApp,
  addContactApp,
  removeContactApp,
  clearDataApp
} = instanceSlice.actions

export const instanceSelector = state => state.whatsApp.instance?.instance
export const profileSelector = state => state.whatsApp.instance?.profile
export const contactsSelector = (state: AppRootStateType) =>
  state?.whatsApp?.instance?.contacts ?? []

export const contactsCountSelector = createSelector(
  contactsSelector,
  contacts => contacts.length
)
