import { RootState } from '@redux/store'
import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
  apiKey?: string
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
    setApiKey: (state, action) => {
      state.apiKey = action.payload
    },
  },
})

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectApiKey = (state: RootState) => state.ui.apiKey

export default uiSlice.reducer
