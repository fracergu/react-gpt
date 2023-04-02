import {
  type Chat,
  type Chats,
  type FetchStatus,
  type Message,
} from '@models/chat.model'
import { v4 as uuid } from 'uuid'
import { create } from 'zustand'

interface ChatsStore {
  currentChat: string | null
  chats: Chats
  createChat: () => void
  setCurrentChat: (chatId: string) => void
  deleteChat: (chatId: string) => void
  addMessage: (chatId: string, message: Message) => void
  setFetchStatus: (chatId: string, fetchStatus: FetchStatus) => void
  setFetchError: (chatId: string, fetchError: string | null) => void
  setIncomingMessage: (chatId: string, message: Message | null) => void
  setNextTailMessageIgnored: (chatId: string) => void
}

const createNewChat = (): Chat => ({
  id: uuid(),
  messages: [],
  createdAt: Date.now(),
  incomingMessage: null,
  fetchError: null,
  fetchStatus: 'idle',
})

const ignoreNextTailMessage = (messages: Message[]): Message[] => {
  const messageToIgnoreIndex = messages.findIndex(m => !m.ignored)
  return messageToIgnoreIndex === -1
    ? messages
    : messages.map((m, i) =>
        i === messageToIgnoreIndex ? { ...m, ignored: true } : m,
      )
}

export const useChatsStore = create<ChatsStore>((set, get) => ({
  currentChat: null,
  chats: JSON.parse(localStorage.getItem('chats') ?? '{}'),

  createChat: () => {
    set(state => {
      const newChat = createNewChat()
      return {
        chats: {
          ...state.chats,
          [newChat.id]: newChat,
        },
        currentChat: newChat.id,
      }
    })
  },
  setCurrentChat: (chatId: string) => {
    set(state => ({
      ...state,
      currentChat: chatId,
    }))
  },
  deleteChat: (chatId: string) => {
    set(state => {
      const { [chatId]: _, ...chats } = state.chats
      return {
        ...state,
        chats,
        currentChat: null,
      }
    })
  },
  addMessage: (chatId: string, message: Message) => {
    set(state => {
      const chat = state.chats[chatId]
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            messages: [...chat.messages, message],
            incomingMessage: null,
            fetchError: null,
          },
        },
      }
    })
  },
  setFetchStatus: (chatId: string, fetchStatus: FetchStatus) => {
    set(state => {
      const chat = state.chats[chatId]
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            fetchStatus,
          },
        },
      }
    })
  },
  setIncomingMessage: (chatId: string, message: Message | null) => {
    set(state => {
      const chat = state.chats[chatId]
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            incomingMessage: message,
          },
        },
      }
    })
  },
  setFetchError: (chatId: string, error: string | null) => {
    set(state => {
      const chat = state.chats[chatId]
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            fetchError: error,
            fetchStatus: 'failed',
          },
        },
      }
    })
  },
  setNextTailMessageIgnored: (chatId: string) => {
    set(state => {
      const chat = state.chats[chatId]
      const messages = get().chats[chatId].messages
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            messages: ignoreNextTailMessage(messages),
          },
        },
      }
    })
  },
}))

useChatsStore.subscribe(({ chats }) => {
  localStorage.setItem('chats', JSON.stringify(chats))
})
