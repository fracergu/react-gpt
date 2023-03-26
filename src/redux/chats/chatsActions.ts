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

export const ignoreNextTailMessage =
  (chatId: string) => (dispatch: Dispatch) => {
    dispatch({
      type: 'chats/ignoreNextTailMessage',
      payload: chatId,
    })
  }
