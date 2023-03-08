import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit'

import uiReducer from '@redux/ui/uiSlice'
import chatsReducer from '@redux/chats/chatsSlice'

const rootReducer = combineReducers({
  ui: uiReducer,
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
    ui: uiReducer,
    chats: chatsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default store
