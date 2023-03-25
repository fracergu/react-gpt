import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Chatbox, { ChatboxTestIds } from '../Chatbox'
import { Role } from '@models/chat.model'
import { renderWithProviders } from 'src/utils/test-utils'
import { RootState } from '@redux/store'
import { initialState as initialChatsState } from '@redux/chats/chatsSlice'
import { initialState as initialUiState } from '@redux/ui/uiSlice'
import { RegenerateResponseTestIds } from '@components/RegenerateResponse/RegenerateResponse'

describe('Chatbox', () => {
  // fix for scrollIntoView not being implemented in jsdom
  window.HTMLElement.prototype.scrollIntoView = function () {}

  const preloadedState: RootState = {
    chats: {
      ...initialChatsState,
      currentChatId: '1',
      chats: {
        '1': {
          id: '1',
          messages: [
            {
              role: Role.USER,
              content: 'Hello',
            },
            {
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

  it('renders chatbox with messages', () => {
    renderWithProviders(<Chatbox />, { preloadedState })
    const chatboxContainer = screen.getByTestId(ChatboxTestIds.Container)
    expect(chatboxContainer).toBeInTheDocument()

    const messages = screen.getAllByText(/Hello|Hi there!/i)
    expect(messages).toHaveLength(2)
  })

  it('renders incoming message', () => {
    const incomingMessage = {
      role: Role.ASSISTANT,
      content: 'Incoming message',
    }

    const stateWithIncomingMessage = {
      ...preloadedState,
      chats: {
        ...preloadedState.chats,
        chats: {
          ...preloadedState.chats.chats,
          '1': {
            ...preloadedState.chats.chats['1'],
            incomingMessage,
          },
        },
      },
    }

    renderWithProviders(<Chatbox />, {
      preloadedState: stateWithIncomingMessage,
    })

    const incomingMessageElement = screen.getByText('Incoming message')
    expect(incomingMessageElement).toBeInTheDocument()
  })

  it('renders RegenerateResponse component on error', () => {
    const stateWithError = {
      ...preloadedState,
      chats: {
        ...preloadedState.chats,
        chats: {
          ...preloadedState.chats.chats,
          '1': {
            ...preloadedState.chats.chats['1'],
            fetchError: 'Error',
          },
        },
      },
    }
    renderWithProviders(<Chatbox />, { preloadedState: stateWithError })

    const regenerateResponse = screen.getByTestId(
      RegenerateResponseTestIds.Container,
    )
    expect(regenerateResponse).toBeInTheDocument()
  })
})
