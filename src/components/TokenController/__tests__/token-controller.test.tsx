import { type Chat } from '@models/chat.model'
import { CHATS_MOCK } from '@models/mocks/chat.mock'
import { fireEvent, screen, render } from '@testing-library/react'
import { vi } from 'vitest'

import TokenController, { TokenControllerTestIds } from '../TokenController'

const generateChatMockWithTokens = (tokens: number): Chat => ({
  ...CHATS_MOCK['1'],
  messages: [
    {
      ...CHATS_MOCK['1'].messages[0],
      tokens,
    },
  ],
})

describe('TokenController', () => {
  beforeEach(() => {
    vi.mock('@redux/ui/useUiStore', () => ({
      useUiStore: () => ({
        autoPromptCleanup: true,
      }),
    }))
  })

  it('should display the correct number of incoming tokens', () => {
    const inputTokens = 10
    render(
      <TokenController
        inputTokens={inputTokens}
        chat={generateChatMockWithTokens(0)}
      />,
    )
    expect(screen.getByText(`Input tokens: ${inputTokens}`)).toBeInTheDocument()
  })

  it('should display the correct number of prompt tokens', () => {
    render(
      <TokenController inputTokens={0} chat={generateChatMockWithTokens(0)} />,
    )
    expect(screen.getByText(`Current prompt tokens:`)).toBeInTheDocument()
  })

  it('should toggle auto prompt clean checkbox', () => {
    render(
      <TokenController inputTokens={0} chat={generateChatMockWithTokens(0)} />,
    )
    const checkbox = screen.getByLabelText('Auto prompt clean')
    expect(checkbox).toBeInTheDocument()

    fireEvent.change(checkbox, { target: { checked: false } })
    expect(checkbox).not.toBeChecked()

    fireEvent.change(checkbox, { target: { checked: true } })
    expect(checkbox).toBeChecked()
  })

  it('should render green color when total tokens is less than 50%', () => {
    render(
      <TokenController
        inputTokens={0}
        chat={generateChatMockWithTokens(1000)}
      />,
    )
    const totalTokens = screen.getByTestId(TokenControllerTestIds.TotalTokens)
    expect(totalTokens).toHaveClass('text-green-500')
  })

  it('should render yellow color when total tokens is between 50% and 75%', () => {
    render(
      <TokenController
        inputTokens={0}
        chat={generateChatMockWithTokens(3000)}
      />,
    )
    const totalTokens = screen.getByTestId(TokenControllerTestIds.TotalTokens)
    expect(totalTokens).toHaveClass('text-yellow-500')
  })

  it('should render orange color when total tokens is between 75% and 90%', () => {
    render(
      <TokenController
        inputTokens={0}
        chat={generateChatMockWithTokens(3500)}
      />,
    )
    const totalTokens = screen.getByTestId(TokenControllerTestIds.TotalTokens)
    expect(totalTokens).toHaveClass('text-orange-500')
  })

  it('should render red color when total tokens is greater than 90%', () => {
    render(
      <TokenController
        inputTokens={0}
        chat={generateChatMockWithTokens(4000)}
      />,
    )
    const totalTokens = screen.getByTestId(TokenControllerTestIds.TotalTokens)
    expect(totalTokens).toHaveClass('text-red-500')
  })
})
