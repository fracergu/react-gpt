import { useAppDispatch } from '@redux/hooks'
import { useEffect, useState } from 'react'

export function useLoadLocalStorage() {
  const [loaded, setLoaded] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedChats = localStorage.getItem('chats')
    if (savedChats) {
      dispatch({
        type: 'chats/setChats',
        payload: JSON.parse(savedChats),
      })
    }
    const theme = localStorage.getItem('theme')
    if (theme) {
      dispatch({
        type: 'ui/setTheme',
        payload: theme,
      })
    }
    setLoaded(true)
  }, [])

  return loaded
}
