import { renderWithProviders } from 'src/utils/test-utils'
import { screen } from '@testing-library/react'
import ChatInput, { ChatInputTestIds } from '../ChatInput'

describe('ChatInput', () => {
  it('renders the chat input', () => {
    renderWithProviders(<ChatInput />)
    expect(screen.getByTestId(ChatInputTestIds.Container)).toBeInTheDocument()
    expect(screen.getByTestId(ChatInputTestIds.Textarea)).toBeInTheDocument()
    expect(screen.getByTestId(ChatInputTestIds.SendButton)).toBeInTheDocument()
  })

  // TODO: Add tests for the textarea and send button
})
