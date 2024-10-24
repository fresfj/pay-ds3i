import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chatPanel/chat',
  initialState: {
    messages: [],
    contacts: [],
    connected: false,
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    updateMessage: (state, action) => {
      const { messageId, newMessage } = action.payload
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId)
      if (messageIndex !== -1) {
        state.messages[messageIndex] = newMessage
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload)
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { deleteMessage, addMessage, setConnected, setError } =
  chatSlice.actions
export default chatSlice.reducer
