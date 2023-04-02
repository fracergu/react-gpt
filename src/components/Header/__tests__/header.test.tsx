import { fireEvent, screen, render } from '@testing-library/react'
import Swal from 'sweetalert2'
import { vi } from 'vitest'

import Header, { HeaderTestIds } from '../Header'

const appDispatchMock = vi.fn()

describe('ChatHeader', () => {
  vi.mock('@redux/ui/useUiStore', () => ({
    useUiStore: () => ({
      sidebarOpen: false,
      toggleSidebar: appDispatchMock,
    }),
  }))

  beforeEach(() => {
    render(<Header />)
  })

  it('renders header with robot icon and title', () => {
    const headerContainer = screen.getByTestId(HeaderTestIds.Container)
    expect(headerContainer).toBeInTheDocument()

    const robotIcon = screen.getByAltText('robot')
    expect(robotIcon).toBeInTheDocument()

    const title = screen.getByText('React GPT')
    expect(title).toBeInTheDocument()
  })

  it('renders info and GitHub buttons', () => {
    const infoButton = screen.getByAltText('info').closest('button')
    expect(infoButton).toBeInTheDocument()
    const githubLink = screen.getByAltText('github').closest('a')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/fracergu/react-gpt',
    )
  })

  it('calls handleMenuButtonClick on menu button click', () => {
    const menuButton = screen.getByAltText('menu').closest('button')
    fireEvent.click(menuButton as HTMLElement)
    expect(appDispatchMock).toHaveBeenCalledTimes(1)
  })

  it('calls handleInfoButtonClick on info button click', () => {
    const spy = vi.spyOn(Swal, 'fire')
    const infoButton = screen.getByAltText('info').closest('button')
    fireEvent.click(infoButton as HTMLElement)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
