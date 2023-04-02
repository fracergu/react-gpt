import { ApiKeyPromptTestIds } from '@components/ApiKeyPrompt/ApiKeyPrompt'
import { HeaderTestIds } from '@components/Header/Header'
import { screen, render } from '@testing-library/react'
import App, { AppTestIds } from 'src/App'

describe('App', () => {
  it('renders the app', () => {
    render(<App />)
    expect(screen.getByTestId(AppTestIds.Container)).toBeInTheDocument()
  })

  it('renders the header', () => {
    render(<App />)
    expect(screen.getByTestId(HeaderTestIds.Container)).toBeInTheDocument()
  })

  it('renders ApiKeyPrompt when no api key is set', () => {
    render(<App />)
    expect(
      screen.getByTestId(ApiKeyPromptTestIds.Container),
    ).toBeInTheDocument()
  })
})
