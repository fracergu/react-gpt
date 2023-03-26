import chatsReducer from '@redux/chats/chatsSlice'
import uiReducer from '@redux/ui/uiSlice'
import {
  type PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  chats: chatsReducer,
  ui: uiReducer,
})

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

const store = setupStore()

store.subscribe(() => {
  const { chats: chatsState, ui: uiState } = store.getState()
  localStorage.setItem('chats', JSON.stringify(chatsState.chats))
  localStorage.setItem('ui', JSON.stringify(uiState))
})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default store
