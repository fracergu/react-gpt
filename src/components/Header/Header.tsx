import { Theme } from '@enums/theme.enum'
import moon from '@assets/moon.svg'
import sun from '@assets/sun.svg'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { selectTheme } from '@redux/ui/uiSlice'

export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)

  return (
    <nav
      data-testid={HeaderTestIds.Container}
      className="p-4 flex justify-center font-open-sans"
    >
      <h1 className="text-2xl ">React-GPT-Client</h1>
      <button
        style={{ width: '30px', height: '30px', background: 'none' }}
        className="ml-2 p-1 rounded bg-gray-200 hover:bg-gray-300"
        onClick={() => dispatch({ type: 'ui/toggleTheme' })}
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
