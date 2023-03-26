import { useAppDispatch } from '@redux/hooks'
import { useEffect, useState } from 'react'

export const useLocalApiKeyHandler = () => {
  const dispatch = useAppDispatch()

  const getApiKeyFromLocalStorage = () => {
    const ui = localStorage.getItem('ui')
    if (ui === null) return null
    const parsedUi = JSON.parse(ui)
    return parsedUi.apiKey
  }

  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY
  const localApiKey = getApiKeyFromLocalStorage()

  const [apiKey, setApiKey] = useState<string | null>(
    localApiKey ?? envApiKey ?? null,
  )

  useEffect(() => {
    if (apiKey === null || envApiKey === null) return
    dispatch({
      type: 'ui/setApiKey',
      payload: apiKey,
    })
  }, [apiKey])

  return {
    apiKey,
    setApiKey,
  }
}
