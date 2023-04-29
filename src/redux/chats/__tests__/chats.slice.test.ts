/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Chats, type Message, Role } from '@models/chat.model'
import { v4 as uuid } from 'uuid'
import { vi } from 'vitest'

import chatsSlice, { type ChatsState, initialState } from '../chats.slice'

vi.mock('uuid', () => {
  let counter = 0
  return {
    v4: vi.fn(() => {
      counter += 1
      return `fake-uuid-${counter}`
    }),
  }
})

describe('chatsSlice.reducer', () => {
  describe('updateChatIncomingMessage', () => {
    it('should set chats state to the given chats', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {},
      }

      const chats: Chats = {
        testChatId: {
          id: 'testChatId',
          messages: [],
          createdAt: Date.now(),
        },
      }

      const newState = chatsSlice(testState, {
        type: 'chats/setChats',
        payload: chats,
      })

      expect(newState.chats).toEqual(chats)
    })

    it('should create a new chat and set currentChatId to the new chat id', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {},
      }

      const newState = chatsSlice(testState, {
        type: 'chats/createChat',
      })

      const newChatId = newState.currentChatId!
      const newChat = newState.chats[newChatId]

      expect(newChat).toBeDefined()
      expect(newChat.id).toBe(newChatId)
      expect(newChat.messages).toEqual([])
      expect(newChat.createdAt).toBeLessThanOrEqual(Date.now())

      expect(uuid).toHaveBeenCalled()
    })

    it('should set currentChatId to the given chat id', () => {
      const testState: ChatsState = {
        ...initialState,
        currentChatId: 'oldChatId',
      }

      const newChatId = 'newChatId'

      const newState = chatsSlice(testState, {
        type: 'chats/loadChat',
        payload: newChatId,
      })

      expect(newState.currentChatId).toEqual(newChatId)
    })

    it('should delete the specified chat and set fetchStatus to IDLE', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {
          testChatId: {
            id: 'testChatId',
            messages: [],
            createdAt: Date.now(),
          },
        },
        fetchStatus: FetchStatus.IDLE,
      }

      const newState = chatsSlice(testState, {
        type: 'chats/deleteChat',
        payload: 'testChatId',
      })

      expect(newState.chats.testChatId).toBeUndefined()
      expect(newState.fetchStatus).toEqual(FetchStatus.IDLE)
    })

    it('should add a message to the specified chat', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {
          testChatId: {
            id: 'testChatId',
            messages: [],
            createdAt: Date.now(),
          },
        },
      }

      const chatId = 'testChatId'
      const message: Message = {
        id: '1',
        role: Role.USER,
        content: 'test message',
        tokens: 10,
        ignored: false,
      }

      const newState = chatsSlice(testState, {
        type: 'chats/addMessage',
        payload: {
          chatId,
          message,
        },
      })

      expect(newState.chats[chatId].messages).toEqual([message])
    })

    it('should remove the last message if both last message and new message have Role.USER', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {
          testChatId: {
            id: 'testChatId',
            messages: [
              {
                id: '1',
                role: Role.USER,
                content: 'test message 1',
                tokens: 10,
                ignored: false,
              },
            ],
            createdAt: Date.now(),
          },
        },
      }

      const chatId = 'testChatId'
      const message: Message = {
        id: '2',
        role: Role.USER,
        content: 'test message 2',
        tokens: 10,
        ignored: false,
      }

      const newState = chatsSlice(testState, {
        type: 'chats/addMessage',
        payload: {
          chatId,
          message,
        },
      })

      expect(newState.chats[chatId].messages.length).toBe(1)
      expect(newState.chats[chatId].messages[0]).toEqual(message)
    })

    it('should update fetchStatus to the given value', () => {
      const testState: ChatsState = {
        ...initialState,
        fetchStatus: FetchStatus.IDLE,
      }

      const newState = chatsSlice(testState, {
        type: 'chats/updateFetchStatus',
        payload: FetchStatus.LOADING,
      })

      expect(newState.fetchStatus).toEqual(FetchStatus.LOADING)
    })

    it('should update incomingMessage in the specified chat', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {
          testChatId: {
            id: 'testChatId',
            messages: [],
            createdAt: Date.now(),
          },
        },
      }

      const chatId = 'testChatId'
      const message: Message = {
        id: '1',
        role: Role.USER,
        content: 'test message',
        tokens: 10,
        ignored: false,
      }

      const newState = chatsSlice(testState, {
        type: 'chats/updateChatIncomingMessage',
        payload: {
          chatId,
          message,
        },
      })

      expect(newState.chats[chatId].incomingMessage).toEqual(message)
    })

    it('should set fetchError in the specified chat and set fetchStatus to FAILED', () => {
      const testState: ChatsState = {
        ...initialState,
        chats: {
          testChatId: {
            id: 'testChatId',
            messages: [],
            createdAt: Date.now(),
          },
        },
        fetchStatus: FetchStatus.IDLE,
      }

      const chatId = 'testChatId'
      const errorMessage = 'test error message'

      const newState = chatsSlice(testState, {
        type: 'chats/updateChatFetchError',
        payload: {
          chatId,
          errorMessage,
        },
      })

      expect(newState.chats[chatId].fetchError).toEqual(errorMessage)
      expect(newState.fetchStatus).toEqual(FetchStatus.FAILED)
    })

    it('should set ignored to true for the first non-ignored message in the specified chat', () => {
      const chatId = 'testChatId'
      const messages: Message[] = [
        {
          id: '1',
          role: Role.USER,
          content: 'test message 1',
          tokens: 10,
          ignored: false,
        },
        {
          id: '2',
          role: Role.USER,
          content: 'test message 2',
          tokens: 10,
          ignored: true,
        },
        {
          id: '3',
          role: Role.USER,
          content: 'test message 3',
          tokens: 10,
          ignored: false,
        },
      ]

      const testState: ChatsState = {
        ...initialState,
        chats: {
          [chatId]: {
            id: chatId,
            messages,
            createdAt: Date.now(),
          },
        },
      }

      const newState = chatsSlice(testState, {
        type: 'chats/ignoreNextTailMessage',
        payload: chatId,
      })

      expect(newState.chats[chatId].messages[0].ignored).toEqual(true)
      expect(newState.chats[chatId].messages[1].ignored).toEqual(true)
      expect(newState.chats[chatId].messages[2].ignored).toEqual(false)
    })
  })
})
