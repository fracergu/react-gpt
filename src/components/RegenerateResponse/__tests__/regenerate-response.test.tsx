import { MOCK_STATE } from '@redux/mocks/state.mock'
import { type RootState } from '@redux/store'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@utils/test.utils'
import { vi } from 'vitest'

import RegenerateResponse, {
  RegenerateResponseTestIds,
} from '../RegenerateResponse'

describe('RegenerateResponse', () => {
  const setInputMessagesMock = vi.fn()

  const currentChatMock = MOCK_STATE.chats.chats['1']

  beforeEach(() => {
    setInputMessagesMock.mockClear()
  })

  it('renders the regenerate response container', () => {
    renderWithProviders(
      <RegenerateResponse
        setInputMessages={setInputMessagesMock}
        currentChat={currentChatMock}
      />,
    )
    expect(
      screen.getByTestId(RegenerateResponseTestIds.Container),
    ).toBeInTheDocument()
  })

  it('displays the error message', () => {
    renderWithProviders(
      <RegenerateResponse
        setInputMessages={setInputMessagesMock}
        currentChat={currentChatMock}
      />,
    )
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('renders the regenerate response button and triggers setInputMessages', () => {
    const currentChatWithErrorMock = {
      ...currentChatMock,
      fetchError: 'Error',
    }

    const preloadedState: RootState = {
      ...MOCK_STATE,
      chats: {
        ...MOCK_STATE.chats,
        currentChatId: '1',
        chats: {
          '1': {
            ...MOCK_STATE.chats.chats['1'],
            fetchError: 'Error',
          },
        },
      },
    }

    renderWithProviders(
      <RegenerateResponse
        setInputMessages={setInputMessagesMock}
        currentChat={currentChatWithErrorMock}
      />,
      { preloadedState },
    )
    const regenerateButton = screen.getByText(/Regenerate response/)
    expect(regenerateButton).toBeInTheDocument()

    fireEvent.click(regenerateButton)
    expect(setInputMessagesMock).toHaveBeenCalledTimes(1)
  })
})
