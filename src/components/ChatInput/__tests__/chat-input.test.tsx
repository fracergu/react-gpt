import { CHATS_MOCK } from '@models/mocks/chat.mock'
import { screen, fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'

import ChatInput from '../ChatInput'

const addMessageMock = vi.fn()

vi.mock('@redux/chats/useChatsStore', () => ({
  useChatsStore: () => ({
    addMessage: addMessageMock,
  }),
}))

describe('ChatInput', () => {
  const setInputMessages = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    render(
      <ChatInput setInputMessages={setInputMessages} chat={CHATS_MOCK['1']} />,
    )
  })

  it('renders chat input with textarea and send button', () => {
    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')
    expect(textarea).toBeInTheDocument()
    expect(sendButton).toBeInTheDocument()
  })

  it('calls setInputMessages on send button click', () => {
    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    expect(addMessageMock).toHaveBeenCalledTimes(1)
    expect(setInputMessages).toHaveBeenCalledTimes(1)
    expect(textarea).toHaveValue('')
  })

  it('sends message on Enter press', () => {
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
    expect(addMessageMock).toHaveBeenCalledTimes(1)
    expect(setInputMessages).toHaveBeenCalledTimes(1)
    expect(textarea).toHaveValue('')
  })
})
