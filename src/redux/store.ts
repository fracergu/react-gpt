import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit'

import chatsReducer from '@redux/chats/chatsSlice'
import uiReducer from '@redux/ui/uiSlice'

const rootReducer = combineReducers({
  chats: chatsReducer,
  ui: uiReducer,
})

const store = configureStore({
  reducer: {
    chats: chatsReducer,
    ui: uiReducer,
  },
})

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

store.subscribe(() => {
  const { chats: chatsState, ui: uiState } = store.getState()
  localStorage.setItem('chats', JSON.stringify(chatsState.chats))
  localStorage.setItem('ui', JSON.stringify(uiState))
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default store
