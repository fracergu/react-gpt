import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'

import CodeBlock, { CodeBlockTestIds } from '../CodeBlock'

const codeContent = `console.log('Hello, World!')`

const createRegExpExecArray = (array: [string, string]): RegExpExecArray => {
  const result = array as unknown as RegExpExecArray
  Object.defineProperty(result, 'groups', {
    value: undefined,
  })
  return result
}

window.prompt = vi.fn()

describe('CodeBlock', () => {
  it('renders a non-inline code block', () => {
    const match = createRegExpExecArray(['', 'javascript'])
    render(
      <CodeBlock inline={false} match={match}>
        {codeContent}
      </CodeBlock>,
    )

    const container = screen.getByTestId(CodeBlockTestIds.Container)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent(codeContent)
  })

  it('renders an inline code block', () => {
    render(
      <CodeBlock match={null} inline>
        {codeContent}
      </CodeBlock>,
    )

    const inlineCodeBlock = screen.getByText(codeContent)
    expect(inlineCodeBlock).toBeInTheDocument()
    expect(inlineCodeBlock.tagName).toBe('CODE')
  })

  it('copies the content and shows "Copied!" message', async () => {
    const match = createRegExpExecArray(['', 'javascript'])
    render(
      <CodeBlock inline={false} match={match}>
        {codeContent}
      </CodeBlock>,
    )

    const copyButton = screen.getByRole('button', { name: 'copy' })
    act(() => {
      fireEvent.click(copyButton)
    })
    const copiedMessage = await screen.findByText('Copied!')
    expect(copiedMessage).toBeInTheDocument()

    if (navigator.clipboard !== undefined) {
      const clipboardText = await navigator.clipboard.readText()
      expect(clipboardText).toBe(codeContent.replace(/\n$/, ''))
    }
  })

  it('removes "Copied!" message after timeout', async () => {
    vi.useFakeTimers()
    const match = createRegExpExecArray(['', 'javascript'])
    render(
      <CodeBlock inline={false} match={match}>
        {codeContent}
      </CodeBlock>,
    )

    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)
    const copiedMessage = screen.getByText('Copied!')
    expect(copiedMessage).toBeInTheDocument()
    act(() => {
      vi.runAllTimers()
    })
    expect(copiedMessage).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
