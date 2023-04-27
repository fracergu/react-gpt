import { useAppDispatch } from '@redux/hooks'
import { setApiKey as setApiKeyAction } from '@redux/ui/uiActions'
import { useEffect, useState } from 'react'

export const useLocalApiKeyHandler = () => {
  const dispatch = useAppDispatch()

  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY
  const localApiKey =
    JSON.parse(localStorage.getItem('ui') ?? '{}')?.apiKey ?? null

  const [apiKey, setApiKey] = useState<string | null>(
    localApiKey ?? envApiKey ?? null,
  )

  useEffect(() => {
    if (apiKey === null || envApiKey === null) return
    dispatch(setApiKeyAction(apiKey))
  }, [apiKey])

  return {
    apiKey,
    setApiKey,
  }
}
