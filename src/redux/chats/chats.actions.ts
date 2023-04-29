import { type FetchStatus } from '@enums/fetchStatus.enum'
import { type Message } from '@models/chat.model'
import { type Dispatch } from '@reduxjs/toolkit'

export const deleteChat = (chatId: string) => (dispatch: Dispatch) => {
  dispatch({
    type: 'chats/deleteChat',
    payload: chatId,
  })
}

export const createChat = () => (dispatch: Dispatch) => {
  dispatch({
    type: 'chats/createChat',
  })
}

export const loadChat = (chatId: string) => (dispatch: Dispatch) => {
  dispatch({
    type: 'chats/loadChat',
    payload: chatId,
  })
}

export const addMessage =
  (chatId: string, message: Message) => (dispatch: Dispatch) => {
    dispatch({
      type: 'chats/addMessage',
      payload: {
        chatId,
        message,
      },
    })
  }

export const updateChatIncomingMessage =
  (chatId: string, message: Message | null) => (dispatch: Dispatch) => {
    dispatch({
      type: 'chats/updateChatIncomingMessage',
      payload: {
        chatId,
        message,
      },
    })
  }

export const updateFetchStatus =
  (fetchStatus: FetchStatus) => (dispatch: Dispatch) => {
    dispatch({
      type: 'chats/updateFetchStatus',
      payload: fetchStatus,
    })
  }

export const ignoreNextTailMessage =
  (chatId: string) => (dispatch: Dispatch) => {
    dispatch({
      type: 'chats/ignoreNextTailMessage',
      payload: chatId,
    })
  }

export const updateChatFetchError =
  (chatId: string, errorMessage: string | undefined) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'chats/updateChatFetchError',
      payload: {
        chatId,
        errorMessage,
      },
    })
  }
