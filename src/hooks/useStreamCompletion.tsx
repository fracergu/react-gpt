import { FetchStatus } from '@enums/fetchStatus.enum'
import { Message, Role } from '@models/chat.model'
import { selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { selectApiKey } from '@redux/ui/uiSlice'
import { useState, useEffect } from 'react'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

const utf8Decoder = new TextDecoder('utf-8')

const decodeResponse = (response?: Uint8Array) => {
  if (!response) {
    return ''
  }

  const pattern = /"delta":\s*({.*?"content":\s*".*?"})/g
  const decodedText = utf8Decoder.decode(response)
  console.log(decodedText)
  const matches: string[] = []

  let match
  while ((match = pattern.exec(decodedText)) !== null) {
    matches.push(JSON.parse(match[1]).content)
  }
  return matches.join('')
}

export const useStreamCompletion = () => {
  const apiKey = OPENAI_API_KEY || useAppSelector(selectApiKey)
  const dispatch = useAppDispatch()
  const currentChatId = useAppSelector(selectCurrentChatId)
  const [inputMessages, setInputMessages] = useState<Message[]>([])
  const abortController = new AbortController()

  useEffect(() => {
    if (!inputMessages.length) return

    const onText = (text: string, isDone = false) => {
      const message = {
        role: Role.ASSISTANT,
        content: text,
      }
      dispatch({
        type: 'chats/updateChatIncomingMessage',
        payload: { chatId: currentChatId, message: isDone ? null : message },
      })
      if (isDone) {
        dispatch({
          type: 'chats/updateFetchStatus',
          payload: FetchStatus.IDLE,
        })
        dispatch({
          type: 'chats/addMessage',
          payload: {
            chatId: currentChatId,
            message,
          },
        })
      }
    }

    const fetchData = async () => {
      dispatch({
        type: 'chats/updateFetchStatus',
        payload: FetchStatus.LOADING,
      })

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: inputMessages,
            model: OPENAI_CHAT_MODEL,
            stream: true,
          }),
          signal: abortController.signal, // assign the abort controller signal to the fetch request
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error)
        }

        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()

        let fullText = ''

        async function read() {
          const { value, done } = await reader.read()

          if (done) return onText(fullText, true)

          const delta = decodeResponse(value)

          if (delta) {
            fullText += delta
            onText(fullText.trim())
          }
          await read()
        }
        await read()
      } catch (error: any) {
        console.log(error)
        dispatch({
          type: 'chats/updateChatFetchError',
          payload: {
            chatId: currentChatId,
            error: error.message,
          },
        })
        abortController.abort()
        return () => {
          abortController.abort()
        }
      }
    }
    fetchData()
    return () => {
      abortController.abort()
    }
  }, [inputMessages])

  return { setInputMessages }
}
