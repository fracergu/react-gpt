import { Theme } from '@enums/theme.enum'
import { useEffect, useState } from 'react'

function updateThemeGlobally() {
  if (
    localStorage.theme === Theme.DARK ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add(Theme.DARK)
  } else {
    document.documentElement.classList.remove(Theme.DARK)
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT)

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
  }

  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (theme !== localTheme) {
      localStorage.setItem('theme', theme)
    }
    updateThemeGlobally()
  }, [theme])

  return { theme, toggleTheme }
}
