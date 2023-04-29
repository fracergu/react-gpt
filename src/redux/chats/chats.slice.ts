import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Chat, type Chats, type Message, Role } from '@models/chat.model'
import { type RootState } from '@redux/store'
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { v4 as uuid } from 'uuid'

const chatsFromLocalStorage = JSON.parse(localStorage.getItem('chats') ?? '{}')

export interface ChatsState {
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
      // TODO: Study this
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.chats[action.payload]
      state.fetchStatus = FetchStatus.IDLE
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>,
    ) => {
      const { chatId, message } = action.payload
      const lastChatMessage = state.chats[chatId].messages.slice(-1)[0]
      if (message.role === Role.USER && lastChatMessage?.role === Role.USER) {
        state.chats[chatId].messages.pop()
      }
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
      action: PayloadAction<{ chatId: string; errorMessage?: string }>,
    ) => {
      const { chatId, errorMessage } = action.payload
      state.chats[chatId].fetchError = errorMessage
      state.fetchStatus = FetchStatus.FAILED
    },
    ignoreNextTailMessage: (state, action: PayloadAction<string>) => {
      const chatId = action.payload
      if (chatId !== '') {
        const nonIgnoredMessages = state.chats[chatId].messages.filter(
          m => !m.ignored,
        )
        if (nonIgnoredMessages.length > 0) {
          nonIgnoredMessages[0].ignored = true
        }
      }
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
    if (currentChatId === undefined) return
    return chats[currentChatId]
  },
)

export const selectFetchStatus = (state: RootState) => state.chats.fetchStatus

export default chatsSlice.reducer
