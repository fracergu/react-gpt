import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit'

import chatsReducer from '@redux/chats/chatsSlice'

const rootReducer = combineReducers({
  chats: chatsReducer,
})

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

const store = configureStore({
  reducer: {
    chats: chatsReducer,
  },
})

store.subscribe(() => {
  const state = store.getState().chats
  localStorage.setItem('chats', JSON.stringify(state.chats))
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default store
