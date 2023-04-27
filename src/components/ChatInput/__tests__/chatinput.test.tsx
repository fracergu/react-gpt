import { LoaderTestIds } from '@components/Loader/Loader'
import { FetchStatus } from '@enums/fetchStatus.enum'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from 'src/utils/test-utils'
import { vi } from 'vitest'

import ChatInput from '../ChatInput'

describe('ChatInput', () => {
  const setInputMessages = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    renderWithProviders(<ChatInput setInputMessages={setInputMessages} />, {
      preloadedState: MOCK_STATE,
    })
  })

  it('renders chat input with textarea and send button', () => {
    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')
    expect(textarea).toBeInTheDocument()
    expect(sendButton).toBeInTheDocument()
  })

  it('calls handleSendMessage on send button click', () => {
    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)

    expect(setInputMessages).toHaveBeenCalledTimes(1)
  })

  it('sends message on Enter press', () => {
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

    expect(setInputMessages).toHaveBeenCalledTimes(1)
  })

  it('does not send message on Shift + Enter press', () => {
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true })

    expect(setInputMessages).toHaveBeenCalledTimes(0)
  })

  it('does not send message on Enter press when textarea is empty', () => {
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: '' } })
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

    expect(setInputMessages).toHaveBeenCalledTimes(0)
  })

  it('shows loading indicator when loading message', () => {
    renderWithProviders(<ChatInput setInputMessages={setInputMessages} />, {
      preloadedState: {
        ...MOCK_STATE,
        chats: {
          ...MOCK_STATE.chats,
          fetchStatus: FetchStatus.LOADING,
        },
      },
    })
    const loadingIndicator = screen.getByTestId(LoaderTestIds.Container)
    expect(loadingIndicator).toBeInTheDocument()
  })
})
