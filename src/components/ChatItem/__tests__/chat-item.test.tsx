import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ChatItem from '../ChatItem'
import { vi } from 'vitest'

describe('ChatItem', () => {
  const handleLoadChatMock = vi.fn()
  const handleDeleteChatMock = vi.fn()

  beforeEach(() => {
    render(
      <ChatItem
        chatId="test-chat-id"
        currentChatId="test-chat-id"
        handleLoadChat={handleLoadChatMock}
        handleDeleteChat={handleDeleteChatMock}
        createdAt="2023-03-25T12:00:00"
      />,
    )
  })

  afterEach(() => {
    handleLoadChatMock.mockClear()
    handleDeleteChatMock.mockClear()
  })

  it('renders the chat item with correct date', () => {
    const chatDate = screen.getByText('2023-03-25T12:00:00')
    expect(chatDate).toBeInTheDocument()
  })

  it('invokes handleLoadChat function on load chat button click', () => {
    const loadChatButton = screen.getByRole('button', {
      name: '2023-03-25T12:00:00',
    })
    fireEvent.click(loadChatButton)
    expect(handleLoadChatMock).toHaveBeenCalledTimes(1)
    expect(handleLoadChatMock).toHaveBeenCalledWith('test-chat-id')
  })

  it('invokes handleDeleteChat function on delete chat button click', () => {
    const deleteChatButton = screen.getByRole('button', { name: 'delete chat' })
    fireEvent.click(deleteChatButton)
    expect(handleDeleteChatMock).toHaveBeenCalledTimes(1)
    expect(handleDeleteChatMock).toHaveBeenCalledWith('test-chat-id')
  })
})
