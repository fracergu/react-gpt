import { type Dispatch } from '@reduxjs/toolkit'

export const setSidebarOpen = (isOpen: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: 'ui/setSidebarOpen',
    payload: isOpen,
  })
}

export const setApiKey = (apiKey: string) => (dispatch: Dispatch) => {
  dispatch({
    type: 'ui/setApiKey',
    payload: apiKey,
  })
}
