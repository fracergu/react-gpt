import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@redux/ui/uiSlice'
import chatsReducer from '@redux/chats/chatsSlice'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    chats: chatsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
