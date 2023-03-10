import { Theme } from '@enums/theme.enum'
import { RootState } from '@redux/store'
import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  theme: Theme
}

export const initialState: UiState = {
  theme: Theme.DARK,
}

function updateThemeGlobally() {
  if (
    localStorage.theme === Theme.DARK ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add(Theme.DARK)
  } else {
    document.documentElement.classList.remove(Theme.DARK)
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
      localStorage.theme = state.theme
      updateThemeGlobally()
    },
    toggleTheme: state => {
      state.theme = state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
      localStorage.theme = state.theme
      updateThemeGlobally()
    },
  },
})

export const selectTheme = (state: RootState) => state.ui.theme

export default uiSlice.reducer
