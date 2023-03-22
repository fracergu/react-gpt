import { RootState } from '@redux/store'
import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
}

export const initialState: UiState = {
  sidebarOpen: true,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen

export default uiSlice.reducer
