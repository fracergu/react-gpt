import { useAppDispatch } from '@redux/hooks'
import { useEffect, useState } from 'react'

export function useLoadLocalStorage() {
  const [loaded, setLoaded] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedChats = localStorage.getItem('chats')

    dispatch({
      type: 'ui/setTheme',
      payload: savedTheme,
    })

    if (savedChats) {
      dispatch({
        type: 'chats/setChats',
        payload: JSON.parse(savedChats),
      })
    }

    setLoaded(true)
  }, [])

  return loaded
}
