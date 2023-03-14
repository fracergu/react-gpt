import { renderWithProviders } from 'src/utils/test-utils'
import { screen } from '@testing-library/react'
import Message, { MessageProps, MessageTestIds } from '../Message'
import { Role } from '@models/chat.model'

describe('Message', () => {
  it('renders the message', () => {
    const MOCKED_PROPS: MessageProps = {
      message: {
        role: Role.USER,
        content: 'Hello',
      },
      idx: 0,
    }
    renderWithProviders(<Message {...MOCKED_PROPS} />)
    expect(screen.getByTestId(MessageTestIds.Container)).toBeInTheDocument()
  })

  //TODO: Add tests for the message properties by role
})
