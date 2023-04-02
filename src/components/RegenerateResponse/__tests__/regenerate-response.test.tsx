import { CHATS_MOCK } from '@models/mocks/chat.mock'
import { fireEvent, screen, render } from '@testing-library/react'
import { vi } from 'vitest'

import RegenerateResponse, {
  RegenerateResponseTestIds,
} from '../RegenerateResponse'

describe('RegenerateResponse', () => {
  const setInputMessagesMock = vi.fn()
  const CHAT_MOCK = CHATS_MOCK['1']

  beforeEach(() => {
    setInputMessagesMock.mockClear()
  })

  it('renders the regenerate response container', () => {
    render(
      <RegenerateResponse
        setInputMessages={setInputMessagesMock}
        chat={CHAT_MOCK}
      />,
    )
    expect(
      screen.getByTestId(RegenerateResponseTestIds.Container),
    ).toBeInTheDocument()
  })

  it('displays the error message', () => {
    render(
      <RegenerateResponse
        setInputMessages={setInputMessagesMock}
        chat={CHAT_MOCK}
      />,
    )
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('renders the regenerate response button and triggers setInputMessages', () => {
    render(
      <RegenerateResponse
        setInputMessages={setInputMessagesMock}
        chat={CHAT_MOCK}
      />,
    )
    const regenerateButton = screen.getByText(/Regenerate response/)
    expect(regenerateButton).toBeInTheDocument()

    fireEvent.click(regenerateButton)
    expect(setInputMessagesMock).toHaveBeenCalledTimes(1)
  })
})
