import { Role } from '@models/chat.model'
import { render, screen } from '@testing-library/react'
import Chatbox, { ChatboxTestIds } from '../Chatbox'

describe('Chatbox', () => {
  const MOCK_MESSAGES = [
    {
      role: Role.USER,
      content: 'Ping',
    },
    {
      role: Role.ASSISTANT,
      content: 'Pong',
    },
  ]

  it('renders the chatbox', () => {
    render(<Chatbox messages={MOCK_MESSAGES} />)
    expect(screen.getByTestId(ChatboxTestIds.Container)).toBeInTheDocument()
  })

  it('renders the messages', () => {
    render(<Chatbox messages={MOCK_MESSAGES} />)
    expect(screen.getByText('Ping')).toBeInTheDocument()
    expect(screen.getByText('Pong')).toBeInTheDocument()
  })
})
