import { type Message } from '@models/chat.model'
import {
  APIError,
  type APIResponseError,
  NoBodyError,
} from '@models/errors.model'
import { useChatsStore } from '@redux/chats/useChatsStore'
import { useUiStore } from '@redux/ui/useUiStore'
import { useEffect, useState } from 'react'
import { getTokenAmount } from 'src/utils/tokens-utils'
import { v4 as uuid } from 'uuid'
import { shallow } from 'zustand/shallow'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

const utf8Decoder = new TextDecoder('utf-8')

const decodeResponse = (response?: Uint8Array) => {
  if (response === null) {
    return ''
  }

  const pattern = /"delta":\s*({.*?"content":\s*".*?"})/g
  const decodedText = utf8Decoder.decode(response)
  const matches: string[] = []

  let match
  while ((match = pattern.exec(decodedText)) !== null) {
    matches.push(JSON.parse(match[1]).content)
  }
  return matches.join('')
}

export const useStreamCompletion = () => {
  const { currentChat } = useChatsStore(
    state => ({
      currentChat:
        state.currentChat !== null ? state.chats[state.currentChat] : null,
    }),
    shallow,
  )

  const { addMessage, setFetchError, setFetchStatus, setIncomingMessage } =
    useChatsStore(state => state, shallow)

  const { apiKey: storeApiKey } = useUiStore()

  const apiKey: string = OPENAI_API_KEY ?? storeApiKey ?? null
  const [inputMessages, setInputMessages] = useState<Message[]>([])
  const abortController = new AbortController()

  useEffect(() => {
    if (inputMessages.length === 0) return

    const onText = (text: string, isDone = false) => {
      if (currentChat === null) return
      const message: Message = {
        id: isDone ? uuid() : '-1',
        role: 'assistant',
        content: text,
        tokens: getTokenAmount(text),
        ignored: false,
      }
      setIncomingMessage(currentChat.id, message)
      if (isDone) {
        addMessage(currentChat.id, message)
        setFetchStatus(currentChat.id, 'idle')
      }
    }

    const cleanMessagesForAPI = (
      messages: Message[],
    ): Array<{ role: string; content: string }> => {
      return messages
        .filter(m => !m.ignored)
        .map(message => {
          const { id, tokens, ignored, ...rest } = message
          return rest
        })
    }

    const fetchData = async () => {
      if (currentChat === null) return

      setFetchStatus(currentChat.id, 'loading')

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: cleanMessagesForAPI(inputMessages),
            model: OPENAI_CHAT_MODEL,
            stream: true,
          }),
          signal: abortController.signal, // assign the abort controller signal to the fetch request
        })

        if (!response.ok) {
          const errorData: APIResponseError = await response.json()
          throw new APIError(errorData)
        }

        if (response.body == null) throw new NoBodyError()

        const reader = response.body.getReader()

        let fullText = ''

        async function read() {
          const { value, done } = await reader.read()

          if (done) {
            onText(fullText, true)
            return
          }

          const delta = decodeResponse(value)

          if (delta !== '') {
            fullText += delta
            onText(fullText.trim())
          }
          await read()
        }
        await read()
      } catch (error: unknown) {
        if (error instanceof APIError || error instanceof NoBodyError) {
          setFetchError(currentChat.id, error.message)
        }
        abortController.abort()
      }
    }
    void fetchData()
    return () => {
      abortController.abort()
    }
  }, [inputMessages])

  return { setInputMessages }
}
