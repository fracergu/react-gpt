import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@redux/store'

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

interface UiState {
  theme: Theme
}

const initialState: UiState = {
  theme: Theme.LIGHT,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
  },
})

export const { setTheme } = uiSlice.actions

export const selectTheme = (state: RootState) => state.ui.theme

export default uiSlice.reducer
