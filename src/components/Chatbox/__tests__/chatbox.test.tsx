import { renderWithProviders } from 'src/utils/test-utils'
import { screen } from '@testing-library/react'
import Chatbox, { ChatboxTestIds } from '../Chatbox'

describe('Chatbox', () => {
  it('renders the chatbox', () => {
    renderWithProviders(<Chatbox />)
    expect(screen.getByTestId(ChatboxTestIds.Container)).toBeInTheDocument()
  })
})
