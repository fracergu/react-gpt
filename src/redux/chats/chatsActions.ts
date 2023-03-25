import { Dispatch } from '@reduxjs/toolkit'

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
