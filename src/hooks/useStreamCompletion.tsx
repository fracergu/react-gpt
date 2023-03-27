import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Message, Role } from '@models/chat.model'
import {
  APIError,
  type APIResponseError,
  NoBodyError,
} from '@models/errors.model'
import { addMessage, updateChatFetchError } from '@redux/chats/chatsActions'
import { selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { selectApiKey } from '@redux/ui/uiSlice'
import { useEffect, useState } from 'react'
import { getTokenAmount } from 'src/utils/tokens-utils'
import { v4 as uuid } from 'uuid'

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
  const apiKey: string =
    OPENAI_API_KEY ?? useAppSelector(selectApiKey) ?? undefined
  const dispatch = useAppDispatch()
  const currentChatId = useAppSelector(selectCurrentChatId)
  const [inputMessages, setInputMessages] = useState<Message[]>([])
  const abortController = new AbortController()

  useEffect(() => {
    if (inputMessages.length === 0) return

    const onText = (text: string, isDone = false) => {
      const message: Message = {
        id: isDone ? uuid() : '-1',
        role: Role.ASSISTANT,
        content: text,
        tokens: getTokenAmount(text),
        ignored: false,
      }
      dispatch({
        type: 'chats/updateChatIncomingMessage',
        payload: { chatId: currentChatId, message: isDone ? null : message },
      })
      if (isDone && currentChatId !== undefined) {
        dispatch({
          type: 'chats/updateFetchStatus',
          payload: FetchStatus.IDLE,
        })
        dispatch(addMessage(currentChatId, message))
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
            messages: cleanMessagesForAPI(inputMessages),
            model: OPENAI_CHAT_MODEL,
            stream: true,
          }),
          signal: abortController.signal, // assign the abort controller signal to the fetch request
        })

        if (!response.ok) {
          const errorData: APIResponseError = await response.json()
          console.log(errorData)
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
          if (currentChatId !== undefined)
            dispatch(updateChatFetchError(currentChatId, error.message))
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
