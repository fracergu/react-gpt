import githubIcon from '@assets/icons/github.svg'
import hamburgerIcon from '@assets/icons/hamburger.svg'
import infoIcon from '@assets/icons/info.svg'
import robotIcon from '@assets/icons/robot.svg'
import { useAppDispatch } from '@redux/hooks'
import Swal from 'sweetalert2'

export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  const dispatch = useAppDispatch()

  const handleMenuButtonClick = () => {
    dispatch({ type: 'ui/toggleSidebar' })
  }

  const handleInfoButtonClick = () => {
    void Swal.fire({
      title: 'About React GPT',
      text: 'The app is still in development and continuously being improved so there might be changes that breaks your current state of the app. If this happens, please use the "Wipe all data" button on the bottom of the sidebar to reset the app. Also cleaning your browser localStorage should work. If you have any suggestions or find any bugs, please open an issue on GitHub.',
      icon: 'info',
      confirmButtonText: 'Cool!',
      confirmButtonColor: '#1d4ed8',
    })
  }

  return (
    <nav
      data-testid={HeaderTestIds.Container}
      className="p-4 md:p-6 flex items-center justify-between font-open-sans bg-slate-800 border-b border-slate-700"
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
        <h1 className="text-xl md:text-2xl font-bold">React GPT</h1>
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
