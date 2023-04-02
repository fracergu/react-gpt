import { useUiStore } from '@redux/ui/useUiStore'
import { useEffect, useState } from 'react'

export const useLocalApiKeyHandler = () => {
  const { setApiKey: dispatchSetApiKey } = useUiStore()

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
    dispatchSetApiKey(apiKey)
  }, [apiKey])

  return {
    apiKey,
    setApiKey,
  }
}
