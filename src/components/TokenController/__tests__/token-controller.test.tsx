import { FetchStatus } from '@enums/fetchStatus.enum'
import { Role } from '@models/chat.model'
import { type RootState } from '@redux/store'
import { screen, cleanup } from '@testing-library/react'
import { renderWithProviders } from 'src/utils/test-utils'

import TokenController, { TokenControllerTestIds } from '../TokenController'

const generatePreloadedState = (messageTokens: number): RootState => ({
  chats: {
    currentChatId: '1',
    chats: {
      '1': {
        id: '1',
        messages: [
          {
            id: '1',
            role: Role.USER,
            content: 'test message 1',
            tokens: messageTokens,
            ignored: false,
          },
        ],
        createdAt: Date.now(),
      },
    },
    fetchStatus: FetchStatus.IDLE,
  },
  ui: {
    sidebarOpen: false,
  },
})

describe('TokenController', () => {
  const renderTokenController = (inputTokens: number, totalTokens: number) => {
    return renderWithProviders(<TokenController inputTokens={inputTokens} />, {
      preloadedState: generatePreloadedState(totalTokens),
    })
  }

  it('should display the correct number of incoming tokens', () => {
    const inputTokens = 10
    renderTokenController(inputTokens, 5)
    expect(screen.getByText(`Input tokens: ${inputTokens}`)).toBeInTheDocument()
  })

  it('should display the correct number of prompt tokens', () => {
    renderTokenController(0, 0)
    expect(screen.getByText(`Current prompt tokens:`)).toBeInTheDocument()
  })

  it('should change color based on the percentage of the token usage', () => {
    renderTokenController(0, 0)
    const totalTokensGreen = screen.getByTestId(
      TokenControllerTestIds.TotalTokens,
    )
    expect(totalTokensGreen).toHaveClass('text-green-500')
    cleanup()

    renderTokenController(0, 3000)
    const totalTokensYellow = screen.getByTestId(
      TokenControllerTestIds.TotalTokens,
    )
    expect(totalTokensYellow).toHaveClass('text-yellow-500')
    cleanup()

    renderTokenController(0, 3500)
    const totalTokensOrange = screen.getByTestId(
      TokenControllerTestIds.TotalTokens,
    )
    expect(totalTokensOrange).toHaveClass('text-orange-500')
    cleanup()

    renderTokenController(0, 4000)
    const totalTokensRed = screen.getByTestId(
      TokenControllerTestIds.TotalTokens,
    )
    expect(totalTokensRed).toHaveClass('text-red-500')
  })
})
