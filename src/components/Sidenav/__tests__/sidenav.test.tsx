import { screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { renderWithProviders } from 'src/utils/test-utils'
import Swal from 'sweetalert2'
import { vi } from 'vitest'

import Sidenav, { SidenavTestIds } from '../Sidenav'

const appDispatchMock = vi.fn()

vi.mock('@redux/hooks', () => ({
  useAppSelector: (selector: any) => selector(),
  useAppDispatch: () => appDispatchMock,
}))

const mockChats = {
  'chat-1': { createdAt: '2023-03-25T12:00:00' },
  'chat-2': { createdAt: '2023-03-25T12:01:00' },
}

vi.mock('@redux/chats/chatsSlice', async () => {
  const actual: any = await vi.importActual('@redux/chats/chatsSlice')
  return {
    ...actual,
    selectChats: () => mockChats,
    selectCurrentChat: () => ({ id: 'chat-1' }),
    selectFetchStatus: () => 'idle',
  }
})

vi.mock('@redux/ui/uiSlice', async () => {
  const actual: any = await vi.importActual('@redux/ui/uiSlice')
  return {
    ...actual,
    selectSidebarOpen: () => true,
  }
})

const mockCreateChat = vi.fn()
const mockLoadChat = vi.fn()
const mockDeleteChat = vi.fn()
const mockSetSidebarOpen = vi.fn()

vi.mock('@redux/chats/chatsActions', async () => {
  const actual: any = await vi.importActual('@redux/chats/chatsActions')
  return {
    ...actual,
    createChat: () => mockCreateChat,
    loadChat: () => mockLoadChat,
    deleteChat: () => mockDeleteChat,
  }
})

vi.mock('@redux/ui/uiActions', async () => {
  const actual: any = await vi.importActual('@redux/ui/uiActions')
  return {
    ...actual,
    setSidebarOpen: () => mockSetSidebarOpen,
  }
})

describe('Sidenav', () => {
  beforeEach(() => {
    renderWithProviders(<Sidenav />)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('renders the create new chat button', () => {
    const createChatButton = screen.getByRole('button', {
      name: 'Create new chat',
    })
    expect(createChatButton).toBeInTheDocument()
  })

  it('renders the chat items', () => {
    const chatItems = screen.getAllByRole('button', {
      name: /\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2}:\d{2}/,
    })
    expect(chatItems).toHaveLength(2)
  })

  it('invokes dispatch with createChat action on create new chat button click', () => {
    const createChatButton = screen.getByRole('button', {
      name: 'Create new chat',
    })
    fireEvent.click(createChatButton)

    expect(appDispatchMock).toHaveBeenCalledTimes(1)
    expect(appDispatchMock).toHaveBeenCalledWith(mockCreateChat)
  })

  it('invokes dispatch with loadChat action on chat item click', () => {
    const chatItem = screen.getByRole('button', { name: '25/3/2023, 12:00:00' })
    fireEvent.click(chatItem)

    expect(appDispatchMock).toHaveBeenCalledTimes(1)
    expect(appDispatchMock).toHaveBeenCalledWith(mockLoadChat)
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

  it('opens delete chat dialog on chat item delete button click', async () => {
    const spy = vi.spyOn(Swal, 'fire')
    const deleteChatButton = await screen.findAllByRole('button', {
      name: 'delete chat',
    })
    fireEvent.click(deleteChatButton[0])
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('invokes dispatch with deleteChat action on delete chat dialog confirm', async () => {
    const spy = vi.spyOn(Swal, 'fire').mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    })
    const deleteChatButton = await screen.findAllByRole('button', {
      name: 'delete chat',
    })
    fireEvent.click(deleteChatButton[0])
    await waitFor(() => {
      expect(appDispatchMock).toHaveBeenCalledTimes(1)
      expect(appDispatchMock).toHaveBeenCalledWith(mockDeleteChat)
    })
    spy.mockRestore()
  })

  it('backdrop click should dispatch closeSidebar action', () => {
    const backdrop = screen.getByTestId(SidenavTestIds.Backdrop)
    fireEvent.click(backdrop)
    expect(appDispatchMock).toHaveBeenCalledTimes(1)
    expect(appDispatchMock).toHaveBeenCalledWith(mockSetSidebarOpen)
  })
})
