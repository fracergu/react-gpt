import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@redux/store'
import { Chat, Message } from '@models/chat.model'
import { v4 as uuid } from 'uuid'
import { FetchStatus } from '@enums/fetchStatus.enum'

interface ChatsState {
  currentChatId?: string
  chats: Chat[]
  fetchStatus: FetchStatus
  incomingMessage?: Message
}

export const initialState: ChatsState = {
  chats: [],
  fetchStatus: FetchStatus.IDLE,
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload
      localStorage.setItem('chats', JSON.stringify(action.payload))
    },
    createChat: state => {
      const newChatId = uuid()
      state.chats.push({
        id: newChatId,
        messages: [],
      })
      state.currentChatId = newChatId
      localStorage.setItem('chats', JSON.stringify(state.chats))
    },
    loadChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload)
      localStorage.setItem('chats', JSON.stringify(state.chats))
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (!state.currentChatId) return
      const currentChat = state.chats.find(
        chat => chat.id === state.currentChatId,
      )
      if (!currentChat) return
      currentChat.messages.push(action.payload)
      localStorage.setItem('chats', JSON.stringify(state.chats))
    },
    updateFetchStatus: (state, action: PayloadAction<FetchStatus>) => {
      state.fetchStatus = action.payload
    },
    updateChatIncomingMessage: (state, action: PayloadAction<Message>) => {
      if (!state.currentChatId) return
      const currentChat = state.chats.find(
        chat => chat.id === state.currentChatId,
      )
      if (!currentChat) return
      currentChat.incomingMessage = action.payload
    },
    updateChatFetchError: (state, action: PayloadAction<string>) => {
      if (!state.currentChatId) return
      const currentChat = state.chats.find(
        chat => chat.id === state.currentChatId,
      )
      if (!currentChat) return
      state.fetchStatus = FetchStatus.FAILED
      currentChat.fetchError = action.payload
    },
  },
})

export const selectChats = (state: RootState) => state.chats.chats
export const selectCurrentChatId = (state: RootState) =>
  state.chats.currentChatId
export const selectCurrentChat = (state: RootState) => {
  if (!state.chats.currentChatId) return
  return state.chats.chats.find(chat => chat.id === state.chats.currentChatId)
}
export const selectFetchStatus = (state: RootState) => state.chats.fetchStatus

export default chatsSlice.reducer
