import robotIcon from '@assets/robot.svg'
import githubIcon from '@assets/github.svg'
import hamburgerIcon from '@assets/hamburger.svg'
import { useAppDispatch } from '@redux/hooks'

export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  const dispatch = useAppDispatch()

  const handleMenuButtonClick = () => {
    dispatch({ type: 'ui/toggleSidebar' })
  }

  return (
    <nav
      data-testid={HeaderTestIds.Container}
      className="p-4 md:p-6 flex items-center justify-between font-open-sans bg-blue-800"
    >
      <button
        className="w-6 h-6 md:w-8 md:h-8 md:hidden"
        onClick={handleMenuButtonClick}
      >
        <img src={hamburgerIcon} alt="menu" />
      </button>
      <div className="flex">
        <img
          src={robotIcon}
          alt="robot"
          className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4"
        />
        <h1 className="align-center text-xl md:text-2xl">React GPT</h1>
      </div>
      <a
        href="https://github.com/fracergu/react-gpt-client"
        rel="noreferrer"
        target="_blank"
      >
        <img src={githubIcon} alt="github" className="w-6 h-6 md:w-8 md:h-8" />
      </a>
    </nav>
  )
}

export default Header
