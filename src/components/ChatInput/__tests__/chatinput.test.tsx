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
})
