import { screen } from '@testing-library/react'
import App, { AppTestIds } from 'src/App'
import { renderWithProviders } from 'src/utils/test-utils'

describe('App', () => {
  it('renders the app', () => {
    renderWithProviders(<App />)
    expect(screen.getByTestId(AppTestIds.Container)).toBeInTheDocument()
  })
})
