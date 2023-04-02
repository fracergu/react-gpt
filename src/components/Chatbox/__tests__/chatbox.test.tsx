import '@testing-library/jest-dom/extend-expect'
import { RegenerateResponseTestIds } from '@components/RegenerateResponse/RegenerateResponse'
import { type Chat } from '@models/chat.model'
import { CHATS_MOCK } from '@models/mocks/chat.mock'
import { screen, render } from '@testing-library/react'
// import { getTokenAmount } from 'src/utils/tokens-utils'

import Chatbox, { ChatboxTestIds } from '../Chatbox'

describe('Chatbox', () => {
  // fix for scrollIntoView not being implemented in jsdom
  window.HTMLElement.prototype.scrollIntoView = function () {}
  // TODO: try this with vi.stubGlobal()

  it('renders chatbox with messages', () => {
    render(<Chatbox chat={CHATS_MOCK['1']} />)
    const chatboxContainer = screen.getByTestId(ChatboxTestIds.Container)
    expect(chatboxContainer).toBeInTheDocument()

    const messages = screen.getAllByText(/Hello|Hi there!/i)
    expect(messages).toHaveLength(2)
  })

  it('renders incoming message', () => {
    const CHAT_MOCK_WITH_INCOMING_MESSAGE: Chat = {
      ...CHATS_MOCK['1'],
      incomingMessage: {
        id: '-1',
        content: 'Incoming message',
        tokens: 0,
        role: 'assistant',
        ignored: false,
      },
    }
    render(<Chatbox chat={CHAT_MOCK_WITH_INCOMING_MESSAGE} />)
    const incomingMessageElement = screen.getByText('Incoming message')
    expect(incomingMessageElement).toBeInTheDocument()
  })

  it('renders RegenerateResponse component on error', () => {
    const CHAT_MOCK_WITH_ERROR: Chat = {
      ...CHATS_MOCK['1'],
      fetchError: 'Error',
    }
    render(<Chatbox chat={CHAT_MOCK_WITH_ERROR} />)
    const regenerateResponse = screen.getByTestId(
      RegenerateResponseTestIds.Container,
    )
    expect(regenerateResponse).toBeInTheDocument()
  })
})
