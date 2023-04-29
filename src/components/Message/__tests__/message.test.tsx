import { CodeBlockTestIds } from '@components/CodeBlock/CodeBlock'
import { Role, type Message as MessageModel } from '@models/chat.model'
import { render, screen } from '@testing-library/react'
import { getTokenAmount } from '@utils/token.utils'

import Message, { MessageTestIds } from '../Message'

const messageUser: MessageModel = {
  id: '1',
  content: 'Hello, I am a **user**.',
  role: Role.USER,
  tokens: getTokenAmount('Hello, I am a **user**.'),
  ignored: false,
}

const messageAssistant: MessageModel = {
  id: '2',
  content: 'Hello, I am an _assistant_.',
  role: Role.ASSISTANT,
  tokens: getTokenAmount('Hello, I am an _assistant_.'),
  ignored: false,
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

  it('renders ignored message with opacity', () => {
    render(<Message message={{ ...messageUser, ignored: true }} />)

    const messageContainer = screen.getByTestId(MessageTestIds.MessageWrapper)
    expect(messageContainer).toBeInTheDocument()
    expect(messageContainer).toHaveClass('opacity-50')
  })

  it('renders message with code block', () => {
    render(
      <Message
        message={{
          ...messageUser,
          content: `
            \`\`\`js
              console.log("Hello world!")
            \`\`\`
          `,
        }}
      />,
    )
    const codeBlock = screen.getByTestId(CodeBlockTestIds.Container)
    expect(codeBlock).toBeInTheDocument()
  })

  it('renders message with inline code block', () => {
    render(
      <Message
        message={{
          ...messageUser,
          content: '`npm install`',
        }}
      />,
    )
    const codeBlock = screen.getByTestId(CodeBlockTestIds.InlineCodeBlock)
    expect(codeBlock).toBeInTheDocument()
  })
})
