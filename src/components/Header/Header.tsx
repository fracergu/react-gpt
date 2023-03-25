import robotIcon from '@assets/robot.svg'
import githubIcon from '@assets/github.svg'
import hamburgerIcon from '@assets/hamburger.svg'
import infoIcon from '@assets/info.svg'
import Swal from 'sweetalert2'
import { useAppDispatch } from '@redux/hooks'

export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  const dispatch = useAppDispatch()

  const handleMenuButtonClick = () => {
    dispatch({ type: 'ui/toggleSidebar' })
  }

  const handleInfoButtonClick = () => {
    Swal.fire({
      title: 'About React GPT',
      text: 'The app is still in development and continuously being improved so there might be changes that breaks your current state of the app. If this happens, please use the "Wipe all data" button on the bottom of de sidebar to reset the app. If you have any suggestions or find any bugs, please open an issue on GitHub.',
      icon: 'info',
      confirmButtonText: 'Cool!',
      confirmButtonColor: '#1d4ed8',
    })
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
        <img src={hamburgerIcon} alt="menu" className="w-full h-full" />
      </button>
      <div className="flex items-center">
        <img
          src={robotIcon}
          alt="robot"
          className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4"
        />
        <h1 className="text-xl md:text-2xl">React GPT</h1>
      </div>
      <div className="flex gap-3">
        <button onClick={handleInfoButtonClick}>
          <img src={infoIcon} alt="info" className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <a
          href="https://github.com/fracergu/react-gpt"
          rel="noreferrer"
          target="_blank"
        >
          <img
            src={githubIcon}
            alt="github"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </a>
      </div>
    </nav>
  )
}

export default Header
