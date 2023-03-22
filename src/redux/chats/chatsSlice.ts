import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { FetchStatus } from '@enums/fetchStatus.enum'
import { Chat, Chats, Message } from '@models/chat.model'
import { RootState } from '@redux/store'
import { createSelector } from 'reselect'

const chatsFromLocalStorage = JSON.parse(localStorage.getItem('chats') || '{}')

interface ChatsState {
  currentChatId?: string
  chats: Chats
  fetchStatus: FetchStatus
  incomingMessage?: Message
}

export const initialState: ChatsState = {
  chats: chatsFromLocalStorage,
  fetchStatus: FetchStatus.IDLE,
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chats>) => {
      state.chats = action.payload
    },
    createChat: state => {
      const newChat: Chat = {
        id: uuid(),
        messages: [],
        createdAt: Date.now(),
      }
      state.chats[newChat.id] = newChat
      state.currentChatId = newChat.id
    },
    loadChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      delete state.chats[action.payload]
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>,
    ) => {
      const { chatId, message } = action.payload
      state.chats[chatId].messages.push(message)
    },
    updateFetchStatus: (state, action: PayloadAction<FetchStatus>) => {
      state.fetchStatus = action.payload
    },
    updateChatIncomingMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>,
    ) => {
      const { chatId, message } = action.payload
      state.chats[chatId].incomingMessage = message
    },
    updateChatFetchError: (
      state,
      action: PayloadAction<{ chatId: string; errorMessage: string }>,
    ) => {
      const { chatId, errorMessage } = action.payload
      state.chats[chatId].fetchError = errorMessage
      state.fetchStatus = FetchStatus.FAILED
    },
  },
})

export const selectChats = (state: RootState) => state.chats.chats
export const selectCurrentChatId = (state: RootState) =>
  state.chats.currentChatId

export const selectCurrentChat = createSelector(
  selectChats,
  selectCurrentChatId,
  (chats, currentChatId) => {
    if (!currentChatId) return
    return chats[currentChatId]
  },
)

export const selectFetchStatus = (state: RootState) => state.chats.fetchStatus

export default chatsSlice.reducer
