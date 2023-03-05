import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@redux/store'
import { Chat, Message, Role } from '@models/chat.model'
import { v4 as uuid } from 'uuid'
import { useAppDispatch } from '@redux/hooks'

interface ChatsState {
  currentChatId?: string
  chats: Chat[]
}

const initialState: ChatsState = {
  chats: [],
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
  },
})

export const { setChats } = chatsSlice.actions

export const selectChats = (state: RootState) => state.chats.chats
export const selectCurrentChatId = (state: RootState) =>
  state.chats.currentChatId

export default chatsSlice.reducer
