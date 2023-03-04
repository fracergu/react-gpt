import { render, screen } from '@testing-library/react'
import App, { AppTestIds } from 'src/App'
import { vi } from 'vitest'

describe('App', () => {
  it('renders the app', () => {
    render(<App />)
    expect(screen.getByTestId(AppTestIds.Container)).toBeInTheDocument()
  })
})
