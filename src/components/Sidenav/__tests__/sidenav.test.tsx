import { render, screen } from '@testing-library/react'
import Sidenav, { SidenavTestIds } from '../Sidenav'

describe('Sidenav', () => {
  it('renders the sidenav', () => {
    render(<Sidenav />)
    expect(screen.getByTestId(SidenavTestIds.Container)).toBeInTheDocument()
  })
})
