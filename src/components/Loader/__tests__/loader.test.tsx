import { render, screen } from '@testing-library/react'
import Loader, { LoaderTestIds } from '../Loader'

describe('Loader', () => {
  it('renders the loader', () => {
    render(<Loader />)
    expect(screen.getByTestId(LoaderTestIds.Container)).toBeInTheDocument()
  })
})
