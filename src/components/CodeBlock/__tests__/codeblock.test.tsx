import { renderWithProviders } from 'src/utils/test-utils'
import { screen } from '@testing-library/react'
import CodeBlock, { CodeBlockProps, CodeBlockTestIds } from '../CodeBlock'
import { ReactNode } from 'react'

describe('CodeBlock', () => {
  const MOCKED_PROPS: CodeBlockProps = {
    match: {} as RegExpExecArray,
    content: {} as ReactNode & ReactNode[],
  }

  it('renders the code block', () => {
    renderWithProviders(<CodeBlock {...MOCKED_PROPS} />)
    expect(screen.getByTestId(CodeBlockTestIds.Container)).toBeInTheDocument()
  })

  // TODO: Add tests for code block when inline is true or false
})
