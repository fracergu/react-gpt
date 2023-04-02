import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Swal from 'sweetalert2'
import { vi } from 'vitest'

import ChatItem from '../ChatItem'

// TODO: to be adjusted after zustand is implemented

describe('ChatItem', () => {
  beforeEach(() => {
    render(
      <ChatItem
        chatId="test-chat-id"
        currentChatId="test-chat-id"
        createdAt="2023-03-25T12:00:00"
      />,
    )
  })

  it('renders the chat item with correct date', () => {
    const chatDate = screen.getByText('2023-03-25T12:00:00')
    expect(chatDate).toBeInTheDocument()
  })

  // TODO: Test select chat button

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

  // TODO: Test remove chat action
})
