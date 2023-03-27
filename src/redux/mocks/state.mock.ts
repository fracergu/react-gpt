import { FetchStatus } from '@enums/fetchStatus.enum'
import { Role } from '@models/chat.model'
import { type RootState } from '@redux/store'

export const MOCK_STATE: RootState = {
  chats: {
    currentChatId: '1',
    chats: {
      '1': {
        id: '1',
        messages: [
          {
            id: '1',
            role: Role.USER,
            content: 'Hello',
            tokens: 1,
            ignored: false,
          },
          {
            id: '2',
            role: Role.ASSISTANT,
            content: 'Hi there!',
            tokens: 3,
            ignored: false,
          },
        ],
        createdAt: Date.now(),
      },
    },
    fetchStatus: FetchStatus.IDLE,
  },
  ui: {
    sidebarOpen: true,
    apiKey: 'sk-012345678901234567890123456789012345678901234567',
    autoPromptCleanup: true,
  },
}
