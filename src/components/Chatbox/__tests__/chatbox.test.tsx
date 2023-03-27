import '@testing-library/jest-dom/extend-expect'
import { RegenerateResponseTestIds } from '@components/RegenerateResponse/RegenerateResponse'
import { Role } from '@models/chat.model'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { type RootState } from '@redux/store'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'src/utils/test-utils'
import { getTokenAmount } from 'src/utils/tokens-utils'

import Chatbox, { ChatboxTestIds } from '../Chatbox'

describe('Chatbox', () => {
  // fix for scrollIntoView not being implemented in jsdom
  window.HTMLElement.prototype.scrollIntoView = function () {}
  // TODO: try this with vi.stubGlobal()

  it('renders chatbox with messages', () => {
    renderWithProviders(<Chatbox />, { preloadedState: MOCK_STATE })
    const chatboxContainer = screen.getByTestId(ChatboxTestIds.Container)
    expect(chatboxContainer).toBeInTheDocument()

    const messages = screen.getAllByText(/Hello|Hi there!/i)
    expect(messages).toHaveLength(2)
  })

  it('renders incoming message', () => {
    const incomingMessage = {
      id: '-1',
      role: Role.ASSISTANT,
      content: 'Incoming message',
      tokens: getTokenAmount('Incoming message'),
      ignored: false,
    }

    const preloadedState: RootState = {
      ...MOCK_STATE,
      chats: {
        ...MOCK_STATE.chats,
        chats: {
          ...MOCK_STATE.chats.chats,
          '1': {
            ...MOCK_STATE.chats.chats['1'],
            messages: [...MOCK_STATE.chats.chats['1'].messages],
            incomingMessage,
          },
        },
      },
    }

    renderWithProviders(<Chatbox />, {
      preloadedState,
    })

    const incomingMessageElement = screen.getByText('Incoming message')
    expect(incomingMessageElement).toBeInTheDocument()
  })

  it('renders RegenerateResponse component on error', () => {
    const preloadedState: RootState = {
      ...MOCK_STATE,
      chats: {
        ...MOCK_STATE.chats,
        chats: {
          ...MOCK_STATE.chats.chats,
          '1': {
            ...MOCK_STATE.chats.chats['1'],
            fetchError: 'Error',
          },
        },
      },
    }
    renderWithProviders(<Chatbox />, { preloadedState })
    const regenerateResponse = screen.getByTestId(
      RegenerateResponseTestIds.Container,
    )
    expect(regenerateResponse).toBeInTheDocument()
  })
})
