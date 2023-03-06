import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@redux/store'
import { Chat, Message, Role } from '@models/chat.model'
import { v4 as uuid } from 'uuid'
import { useAppDispatch } from '@redux/hooks'
import { ApiResponse } from '@models/api-response.model'

enum FetchStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  FAILED = 'failed',
}

interface ChatsState {
  currentChatId?: string
  chats: Chat[]
  fetchStatus: FetchStatus
}

const initialState: ChatsState = {
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
    createChat: (state, action: PayloadAction<void>) => {
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
    fetchStarted: (state, action: PayloadAction<void>) => {
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
    fetchFailed: (state, action: PayloadAction<void>) => {
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

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

export const fetchResponse = createAsyncThunk(
  'chats/fetchResponse',
  async (messages: Message[]) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages,
      }),
    })
    const data: ApiResponse = await response.json()
    return data.choices[0].message
  },
)

export const { setChats } = chatsSlice.actions

export const selectChats = (state: RootState) => state.chats.chats
export const selectCurrentChatId = (state: RootState) =>
  state.chats.currentChatId

export default chatsSlice.reducer
