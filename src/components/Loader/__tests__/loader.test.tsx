import { render, screen } from '@testing-library/react'

import Loader, { LoaderTestIds } from '../Loader'

describe('Loader', () => {
  beforeEach(() => {
    render(<Loader />)
  })

  it('renders the loader container', () => {
    const loaderContainer = screen.getByTestId(LoaderTestIds.Container)
    expect(loaderContainer).toBeInTheDocument()
  })

  it('renders the loader with the correct role and aria-label', () => {
    const loader = screen.getByRole('status', { name: 'Loading...' })
    expect(loader).toBeInTheDocument()
  })
})
