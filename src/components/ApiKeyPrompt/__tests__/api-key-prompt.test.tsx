import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import ApiKeyPrompt from '../ApiKeyPrompt'

describe('ApiKeyPrompt', () => {
  const mockUpdateApiKey = vi.fn()
  const mockValidApiKey = 'sk-012345678901234567890123456789012345678901234567'

  beforeEach(() => {
    mockUpdateApiKey.mockClear()
    window.location.reload = vi.fn()
  })

  it('renders ApiKeyPrompt component', () => {
    render(<ApiKeyPrompt updateApiKey={mockUpdateApiKey} />)
    const apiKeyPromptContainer = screen.getByTestId('api-key-prompt-container')
    expect(apiKeyPromptContainer).toBeTruthy()
  })

  it('updates apiKey state when input changes', () => {
    render(<ApiKeyPrompt updateApiKey={mockUpdateApiKey} />)
    const apiKeyInput = screen.getByPlaceholderText(
      'API key',
    ) as HTMLInputElement
    fireEvent.change(apiKeyInput, { target: { value: 'valid-api-key' } })
    expect(apiKeyInput.value).toBe('valid-api-key')
  })

  it('disables set button when input is invalid', () => {
    render(<ApiKeyPrompt updateApiKey={mockUpdateApiKey} />)
    const apiKeyInput = screen.getByPlaceholderText(
      'API key',
    ) as HTMLInputElement
    const setApiKeyButton = screen.getByText('Set API key')
    fireEvent.change(apiKeyInput, { target: { value: 'invalid-api-key' } })
    expect(setApiKeyButton).toBeDisabled()
  })

  it('enables set button when input is valid', () => {
    render(<ApiKeyPrompt updateApiKey={mockUpdateApiKey} />)
    const apiKeyInput = screen.getByPlaceholderText(
      'API key',
    ) as HTMLInputElement
    const setApiKeyButton = screen.getByText('Set API key')
    fireEvent.change(apiKeyInput, {
      target: { value: mockValidApiKey },
    })

    expect(setApiKeyButton).toBeEnabled()
  })

  it('calls updateApiKey and reloads page when set button is clicked with valid input', () => {
    render(<ApiKeyPrompt updateApiKey={mockUpdateApiKey} />)
    const apiKeyInput = screen.getByPlaceholderText(
      'API key',
    ) as HTMLInputElement
    const setApiKeyButton = screen.getByText('Set API key')
    fireEvent.change(apiKeyInput, {
      target: { value: mockValidApiKey },
    })
    fireEvent.click(setApiKeyButton)
    expect(mockUpdateApiKey).toHaveBeenCalledWith(mockValidApiKey)
    expect(window.location.reload).toHaveBeenCalled()
  })
})
