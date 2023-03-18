import { render, screen } from '@testing-library/react'
import Header, { HeaderTestIds } from '../Header'

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />)
    expect(screen.getByTestId(HeaderTestIds.Container)).toBeInTheDocument()
  })
})
