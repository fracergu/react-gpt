import { screen } from '@testing-library/react'
import { renderWithProviders } from 'src/utils/test-utils'
import Sidenav, { SidenavTestIds } from '../Sidenav'

describe('Sidenav', () => {
  it('renders the sidenav', () => {
    renderWithProviders(<Sidenav />)
    expect(screen.getByTestId(SidenavTestIds.Container)).toBeInTheDocument()
  })
})
