import { Theme } from '@enums/theme.enum'
import { useTheme } from '@hooks/useTheme'
import moon from '../../assets/moon.svg'
import sun from '../../assets/sun.svg'

export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <nav
      data-testid={HeaderTestIds.Container}
      className="p-2 flex justify-center font-open-sans border-b dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
    >
      <h1 className="text-2xl ">React-GPT-Client</h1>
      <button
        style={{ width: '30px', height: '30px', background: 'none' }}
        className="ml-2 p-1 rounded bg-gray-200 hover:bg-gray-300"
        onClick={toggleTheme}
      >
        {theme === Theme.LIGHT ? (
          <img src={moon} alt="moon" />
        ) : (
          <img src={sun} alt="sun" />
        )}
      </button>
    </nav>
  )
}

export default Header
