import { type Dispatch } from '@reduxjs/toolkit'

export const setSidebarOpen = (isOpen: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: 'ui/setSidebarOpen',
    payload: isOpen,
  })
}
