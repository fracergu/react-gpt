import '@testing-library/jest-dom/extend-expect'
import { RegenerateResponseTestIds } from '@components/RegenerateResponse/RegenerateResponse'
import { type Chat, Role } from '@models/chat.model'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@utils/test.utils'
import { getTokenAmount } from '@utils/token.utils'

import Chatbox, { ChatboxTestIds } from '../Chatbox'

describe('Chatbox', () => {
  // fix for scrollIntoView not being implemented in jsdom
  window.HTMLElement.prototype.scrollIntoView = function () {}
  // TODO: try this with vi.stubGlobal()

  const chatMock: Chat = {
    ...MOCK_STATE.chats.chats['1'],
  }

  it('renders chatbox with messages', () => {
    renderWithProviders(<Chatbox currentChat={chatMock} />)
    const chatboxContainer = screen.getByTestId(ChatboxTestIds.Container)
    expect(chatboxContainer).toBeInTheDocument()

    const messages = screen.getAllByText(/Hello|Hi there!/i)
    expect(messages).toHaveLength(2)
  })

  it('renders incoming message', () => {
    const incomingMessageMock = {
      id: '-1',
      role: Role.ASSISTANT,
      content: 'Incoming message',
      tokens: getTokenAmount('Incoming message'),
      ignored: false,
    }

    const testMockedChat = {
      ...chatMock,
      incomingMessage: incomingMessageMock,
    }

    renderWithProviders(<Chatbox currentChat={testMockedChat} />)

    const incomingMessageElement = screen.getByText('Incoming message')
    expect(incomingMessageElement).toBeInTheDocument()
  })

  it('renders RegenerateResponse component on error', () => {
    const testMockedChat = {
      ...chatMock,
      fetchError: 'Error',
    }

    renderWithProviders(<Chatbox currentChat={testMockedChat} />)
    const regenerateResponse = screen.getByTestId(
      RegenerateResponseTestIds.Container,
    )
    expect(regenerateResponse).toBeInTheDocument()
  })
})
