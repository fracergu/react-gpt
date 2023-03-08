import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@redux/store'
import { Chat, Message } from '@models/chat.model'
import { v4 as uuid } from 'uuid'
import { fetchResponse } from './chatsAsyncThunks'
import { FetchStatus } from '@enums/fetchStatus.enum'

interface ChatsState {
  currentChatId?: string
  chats: Chat[]
  fetchStatus: FetchStatus
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
    fetchStarted: state => {
      state.fetchStatus = FetchStatus.LOADING
    },
    fetchSuccess: (state, action: PayloadAction<Message>) => {
      state.fetchStatus = FetchStatus.IDLE
      if (!state.currentChatId) return
      const currentChat = state.chats.find(
        chat => chat.id === state.currentChatId,
      )
      if (!currentChat) return
      currentChat.messages.push(action.payload)
      localStorage.setItem('chats', JSON.stringify(state.chats))
    },
    fetchFailed: state => {
      state.fetchStatus = FetchStatus.FAILED
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchResponse.pending, (state, action) => {
      state.fetchStatus = FetchStatus.LOADING
    })
    builder.addCase(fetchResponse.fulfilled, (state, action) => {
      state.fetchStatus = FetchStatus.IDLE
      if (!state.currentChatId) return
      const currentChat = state.chats.find(
        chat => chat.id === state.currentChatId,
      )
      if (!currentChat) return
      currentChat.messages.push(action.payload as Message)
      localStorage.setItem('chats', JSON.stringify(state.chats))
    })
    builder.addCase(fetchResponse.rejected, (state, action) => {
      state.fetchStatus = FetchStatus.FAILED
    })
  },
})

export const selectChats = (state: RootState) => state.chats.chats
export const selectCurrentChatId = (state: RootState) =>
  state.chats.currentChatId

export const selectFetchStatus = (state: RootState) => state.chats.fetchStatus

export default chatsSlice.reducer
