import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Swal from 'sweetalert2'
import { vi } from 'vitest'

import ChatItem from '../ChatItem'

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

  it('should show SweetAlert2 confirmation when delete button is clicked', async () => {
    const deleteButton = screen.getByAltText('delete chat')
    const swalFireSpy = vi.spyOn(Swal, 'fire')

    fireEvent.click(deleteButton)

    expect(swalFireSpy).toHaveBeenCalledTimes(1)
    expect(swalFireSpy).toHaveBeenCalledWith({
      title: 'Are you sure?',
      text: 'This chat will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#b91c1c',
    })

    swalFireSpy.mockRestore()
  })

  it('should invoke handleDeleteChat function when SweetAlert2 confirmation is confirmed', async () => {
    const deleteButton = screen.getByAltText('delete chat')
    const swalFireSpy = vi.spyOn(Swal, 'fire').mockResolvedValueOnce({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    })

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(handleDeleteChatMock).toHaveBeenCalledTimes(1)
    })
    expect(handleDeleteChatMock).toHaveBeenCalledWith('test-chat-id')

    swalFireSpy.mockRestore()
  })
})
