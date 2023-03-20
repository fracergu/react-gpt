import { renderWithProviders } from 'src/utils/test-utils'
import { screen } from '@testing-library/react'
import RegenerateResponse, {
  RegenerateResponseTestIds,
} from '../RegenerateResponse'

describe('RegenerateResponse', () => {
  it('renders the regenerate response', () => {
    renderWithProviders(<RegenerateResponse setInputMessages={() => {}} />)
    expect(
      screen.getByTestId(RegenerateResponseTestIds.Container),
    ).toBeInTheDocument()
  })
})
