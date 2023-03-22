import { render, screen } from '@testing-library/react'
import { renderWithProviders } from 'src/utils/test-utils'
import Header, { HeaderTestIds } from '../Header'

describe('Header', () => {
  it('renders the header', () => {
    renderWithProviders(<Header />)
    expect(screen.getByTestId(HeaderTestIds.Container)).toBeInTheDocument()
  })
})
