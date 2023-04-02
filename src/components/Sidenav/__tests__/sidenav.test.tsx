import { screen, fireEvent, waitFor, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Swal from 'sweetalert2'
import { vi } from 'vitest'

import Sidenav from '../Sidenav'

const mockCreateChat = vi.fn()
const mockLoadChat = vi.fn()

vi.mock('@redux/ui/useUiStore', () => ({
  useUiStore: () => ({
    autoPromptCleanup: false,
    toggleAutoPromptCleanup: vi.fn(),
  }),
}))

vi.mock('@redux/chats/useChatsStore', () => ({
  useChatsStore: () => ({
    currentChat: {
      id: '1',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'test message 1',
          tokens: 10,
          ignored: false,
        },
      ],
      createdAt: new Date('2021-01-01T00:00:00').getTime(),
    },
    chats: {
      '1': {
        id: '1',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'test message 1',
            tokens: 10,
            ignored: false,
          },
        ],
        createdAt: new Date('2021-01-01T00:00:00').getTime(),
      },
      '2': {
        id: '2',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'test message 1',
            tokens: 10,
            ignored: false,
          },
        ],
        createdAt: new Date('2021-01-01T01:00:00').getTime(),
      },
    },
    createChat: mockCreateChat,
    setCurrentChat: mockLoadChat,
  }),
}))

describe('Sidenav', () => {
  beforeEach(() => {
    render(<Sidenav />)
  })

  it('renders the create new chat button', () => {
    const createChatButton = screen.getByRole('button', {
      name: 'Create new chat',
    })
    expect(createChatButton).toBeInTheDocument()
  })

  it('renders the chat items', () => {
    const chatItems = screen.getAllByRole('button', {
      name: /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2}$/,
    })
    expect(chatItems).toHaveLength(2)
  })

  it('invokes dispatch with createChat action on create new chat button click', () => {
    const createChatButton = screen.getByRole('button', {
      name: 'Create new chat',
    })
    fireEvent.click(createChatButton)
    expect(mockCreateChat).toHaveBeenCalledTimes(1)
  })

  it('invokes dispatch with loadChat action on chat item click', () => {
    const chatItem = screen.getByRole('button', {
      name: '1/1/2021, 0:00:00',
    })
    fireEvent.click(chatItem)
    expect(mockLoadChat).toHaveBeenCalledTimes(1)
  })

  it('renders the wipe all data button', () => {
    const wipeAllDataButton = screen.getByRole('button', {
      name: 'Wipe all data',
    })
    expect(wipeAllDataButton).toBeInTheDocument()
  })

  it('opens the wipe all data dialog on wipe all data button click', () => {
    const spy = vi.spyOn(Swal, 'fire')
    const wipeAllDataButton = screen.getByRole('button', {
      name: 'Wipe all data',
    })
    fireEvent.click(wipeAllDataButton)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('cleans the local storage and makes a reload on wipe all data dialog confirm', async () => {
    const spyLocalStorage = vi.spyOn(window.localStorage, 'clear')
    const spyWindowReload = vi.spyOn(window.location, 'reload')
    const swalFireSpy = vi.spyOn(Swal, 'fire').mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    })
    const wipeAllDataButton = screen.getByRole('button', {
      name: 'Wipe all data',
    })
    fireEvent.click(wipeAllDataButton)
    await waitFor(() => {
      expect(spyLocalStorage).toHaveBeenCalledTimes(1)
      expect(spyWindowReload).toHaveBeenCalledTimes(1)
    })
    swalFireSpy.mockRestore()
  })
})
