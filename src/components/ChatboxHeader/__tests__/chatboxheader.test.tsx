import { renderWithProviders } from 'src/utils/test-utils'
import { screen } from '@testing-library/react'
import ChatboxHeader, { ChatboxHeaderTestIds } from '../ChatboxHeader'

describe('ChatboxHeader', () => {
  it('renders the ChatboxHeader', () => {
    renderWithProviders(<ChatboxHeader />)
    expect(
      screen.getByTestId(ChatboxHeaderTestIds.Container),
    ).toBeInTheDocument()
  })

  // TODO: Test the chatbox dispatch when creating a new chat
})
