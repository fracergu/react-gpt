import { Role } from '@models/chat.model'
import { render, screen } from '@testing-library/react'

import Message, { MessageTestIds } from '../Message'

const messageUser = {
  id: '1',
  content: 'Hello, I am a **user**.',
  role: Role.USER,
}

const messageAssistant = {
  id: '2',
  content: 'Hello, I am an _assistant_.',
  role: Role.ASSISTANT,
}

describe('Message', () => {
  it('renders user message with content and icon', () => {
    render(<Message message={messageUser} />)

    const messageContainer = screen.getByTestId(MessageTestIds.Container)
    expect(messageContainer).toBeInTheDocument()

    const userIcon = screen.getByAltText('user')
    expect(userIcon).toBeInTheDocument()

    const content = screen.getByText((_, node) => {
      const hasText = (n: any) => n.textContent === 'Hello, I am a user.'
      const nodeHasText = hasText(node)
      if (node === null) {
        return false
      }
      const childrenDontHaveText = Array.from(node.children).every(
        child => !hasText(child),
      )
      return nodeHasText && childrenDontHaveText
    })
    expect(content).toBeInTheDocument()
  })

  it('renders assistant message with content and icon', () => {
    render(<Message message={messageAssistant} />)

    const messageContainer = screen.getByTestId(MessageTestIds.Container)
    expect(messageContainer).toBeInTheDocument()

    const assistantIcon = screen.getByAltText('assistant')
    expect(assistantIcon).toBeInTheDocument()

    const content = screen.getByText((_, node) => {
      const hasText = (n: any) => n.textContent === 'Hello, I am an assistant.'
      const nodeHasText = hasText(node)
      if (node === null) {
        return false
      }
      const childrenDontHaveText = Array.from(node.children).every(
        child => !hasText(child),
      )

      return nodeHasText && childrenDontHaveText
    })
    expect(content).toBeInTheDocument()
  })
})
