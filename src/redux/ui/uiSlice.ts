import { RootState } from '@redux/store'
import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
  isMobile: boolean
}

export const initialState: UiState = {
  sidebarOpen: false,
  isMobile: false,
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
    setIsMobile: (state, action) => {
      state.isMobile = action.payload
      state.sidebarOpen = !action.payload
    },
  },
})

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectIsMobile = (state: RootState) => state.ui.isMobile

export default uiSlice.reducer
