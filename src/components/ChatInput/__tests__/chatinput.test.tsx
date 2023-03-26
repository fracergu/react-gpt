import { Role } from '@models/chat.model'
import { initialState as initialChatsState } from '@redux/chats/chatsSlice'
import { type RootState } from '@redux/store'
import { initialState as initialUiState } from '@redux/ui/uiSlice'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from 'src/utils/test-utils'
import { vi } from 'vitest'

import ChatInput from '../ChatInput'

describe('ChatInput', () => {
  const setInputMessages = vi.fn()

  const preloadedState: RootState = {
    chats: {
      ...initialChatsState,
      currentChatId: '1',
      chats: {
        '1': {
          id: '1',
          messages: [
            {
              id: '1',
              role: Role.USER,
              content: 'Hello',
            },
            {
              id: '2',
              role: Role.ASSISTANT,
              content: 'Hi there!',
            },
          ],
          createdAt: Date.now(),
        },
      },
    },
    ui: initialUiState,
  }

  beforeEach(() => {
    vi.resetAllMocks()
    renderWithProviders(<ChatInput setInputMessages={setInputMessages} />, {
      preloadedState,
    })
  })

  it('renders chat input with textarea and send button', () => {
    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')
    expect(textarea).toBeInTheDocument()
    expect(sendButton).toBeInTheDocument()
  })

  it('calls handleSendMessage on send button click', () => {
    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)

    expect(setInputMessages).toHaveBeenCalledTimes(1)
  })

  it('sends message on Enter press', () => {
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

    expect(setInputMessages).toHaveBeenCalledTimes(1)
  })
})
