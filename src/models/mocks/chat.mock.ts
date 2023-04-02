import { type Chats } from '@models/chat.model'

export const CHATS_MOCK: Chats = {
  '1': {
    id: '1',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Hello',
        tokens: 1,
        ignored: false,
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Hi there!',
        tokens: 3,
        ignored: false,
      },
    ],
    createdAt: Date.now(),
    incomingMessage: null,
    fetchError: null,
    fetchStatus: 'idle',
  },
}
