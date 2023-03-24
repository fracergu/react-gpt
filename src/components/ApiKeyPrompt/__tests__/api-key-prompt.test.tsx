import { render, screen } from '@testing-library/react'
import ApiKeyPrompt, { ApiKeyPromptTestIds } from '../ApiKeyPrompt'

describe('ApiKeyPrompt', () => {
  it('should render', () => {
    render(<ApiKeyPrompt updateApiKey={() => {}} />)
    expect(
      screen.getByTestId(ApiKeyPromptTestIds.Container),
    ).toBeInTheDocument()
  })

  //TODO:  Check if the API key is valid and button click
})
