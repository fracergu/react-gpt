import { type Chat, Role, type Message } from '@models/chat.model'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { screen, cleanup } from '@testing-library/react'
import { renderWithProviders } from '@utils/test.utils'
import { vi } from 'vitest'

import TokenController, { TokenControllerTestIds } from '../TokenController'

const dispatchMock = vi.fn()
vi.mock('@redux/hooks', () => ({
  useAppSelector: (selector: any) => selector(),
  useAppDispatch: () => dispatchMock,
}))

const ignoreNextTailMessageMock = vi.fn()
vi.mock('@redux/chats/chats.actions', async () => {
  const actual = await import('@redux/chats/chats.actions')
  return {
    ...actual,
    ignoreNextTailMessage: () => ignoreNextTailMessageMock,
  }
})

describe('TokenController', () => {
  const renderTokenController = (
    inputTokens: number,
    totalTokens: number,
    incomingMessage?: Message,
  ) => {
    const currentChatMock: Chat = {
      ...MOCK_STATE.chats.chats['1'],
      messages: [
        {
          id: '1',
          role: Role.USER,
          content: 'test message 1',
          tokens: totalTokens,
          ignored: false,
        },
      ],
      incomingMessage,
    }

    return renderWithProviders(
      <TokenController
        inputTokens={inputTokens}
        currentChat={currentChatMock}
      />,
    )
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

  it('should dispatch ignoreNextTailMessage when the total tokens is greater than or equal to 4096', () => {
    renderTokenController(0, 4096)
    expect(dispatchMock).toHaveBeenCalledWith(ignoreNextTailMessageMock)
  })

  it('should correctly calculate incomingMessageTokens when incomingMessage is not null', () => {
    const inputTokens = 10
    const chatTokens = 5
    const incomingMessageTokens = 5
    renderTokenController(inputTokens, chatTokens, {
      id: '2',
      role: Role.USER,
      content: 'test incoming message',
      tokens: incomingMessageTokens,
      ignored: false,
    })
    const totalTokens = screen.getByTestId(TokenControllerTestIds.TotalTokens)
    expect(totalTokens.textContent).toBe(
      (chatTokens + incomingMessageTokens).toString(),
    )
  })
})
