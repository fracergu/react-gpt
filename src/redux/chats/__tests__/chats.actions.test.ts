import { type FetchStatus } from '@enums/fetchStatus.enum'
import { type Message } from '@models/chat.model'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { type Dispatch } from '@reduxjs/toolkit'
import { vi } from 'vitest'

import * as chatsActions from '../chats.actions'

describe('chatActions', () => {
  it('should dispatch deleteChat', () => {
    const dispatch: Dispatch = vi.fn()
    const chatId = 'test-chat-id'

    chatsActions.deleteChat(chatId)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/deleteChat',
      payload: chatId,
    })
  })

  it('should dispatch createChat', () => {
    const dispatch: Dispatch = vi.fn()

    chatsActions.createChat()(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/createChat',
    })
  })

  it('should dispatch loadChat', () => {
    const dispatch: Dispatch = vi.fn()
    const chatId = 'test-chat-id'

    chatsActions.loadChat(chatId)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/loadChat',
      payload: chatId,
    })
  })

  it('should dispatch addMessage', () => {
    const dispatch: Dispatch = vi.fn()
    const chatId = 'test-chat-id'
    const message: Message = MOCK_STATE.chats.chats['1'].messages[0]

    chatsActions.addMessage(chatId, message)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/addMessage',
      payload: {
        chatId,
        message,
      },
    })
  })

  it('should dispatch updateChatIncomingMessage', () => {
    const dispatch: Dispatch = vi.fn()
    const chatId = 'test-chat-id'
    const message: Message = MOCK_STATE.chats.chats['1'].messages[0]

    chatsActions.updateChatIncomingMessage(chatId, message)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/updateChatIncomingMessage',
      payload: {
        chatId,
        message,
      },
    })
  })

  it('should dispatch updateFetchStatus', () => {
    const dispatch: Dispatch = vi.fn()
    const fetchStatus = 'test-fetch-status' as FetchStatus

    chatsActions.updateFetchStatus(fetchStatus)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/updateFetchStatus',
      payload: fetchStatus,
    })
  })

  it('should dispatch ignoreNextTailMessage', () => {
    const dispatch: Dispatch = vi.fn()
    const chatId = 'test-chat-id'

    chatsActions.ignoreNextTailMessage(chatId)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/ignoreNextTailMessage',
      payload: chatId,
    })
  })

  it('should dispatch updateChatFetchError', () => {
    const dispatch: Dispatch = vi.fn()
    const chatId = 'test-chat-id'
    const errorMessage = 'test-error-message'
    chatsActions.updateChatFetchError(chatId, errorMessage)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'chats/updateChatFetchError',
      payload: {
        chatId,
        errorMessage,
      },
    })
  })
})
