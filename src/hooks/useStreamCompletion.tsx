import { type Message } from '@models/chat.model'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { selectApiKey } from '@redux/ui/ui.slice'
import { useEffect, useState } from 'react'

import { useStreamFetch } from './useStreamFetch'

export const useStreamCompletion = (currentChatId: string) => {
  const apiKey: string =
    import.meta.env.VITE_OPENAI_API_KEY ??
    useAppSelector(selectApiKey) ??
    undefined
  const dispatch = useAppDispatch()
  const [inputMessages, setInputMessages] = useState<Message[]>([])
  const { fetchData, abortController } = useStreamFetch(
    apiKey,
    inputMessages,
    currentChatId,
    dispatch,
  )

  useEffect(() => {
    if (inputMessages.length === 0) return

    void fetchData()

    return () => {
      abortController.abort()
    }
  }, [inputMessages])

  return { setInputMessages }
}
