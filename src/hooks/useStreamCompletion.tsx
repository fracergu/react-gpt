import { Message } from '@models/chat.model'
import { useState, useEffect } from 'react'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

const utf8Decoder = new TextDecoder('utf-8')

const decodeResponse = (response?: Uint8Array) => {
  if (!response) {
    return ''
  }

  const pattern = /"content"\s*:\s*"([^"]*)"/g
  const decodedText = utf8Decoder.decode(response)
  const matches: string[] = []

  let match
  while ((match = pattern.exec(decodedText)) !== null) {
    matches.push(match[1])
  }

  console.log('matches', matches)

  if (!!matches.length && matches[0] === '\n\n') matches.shift()

  return matches.join('')
}

export const useStreamCompletion = () => {
  const [partialText, setPartialText] = useState('')
  const [fullText, setFullText] = useState('')
  const [inputMessages, setInputMessages] = useState<Message[]>([])
  const abortController = new AbortController()

  useEffect(() => {
    if (!inputMessages.length) return

    const onText = (text: string) => {
      setPartialText(text)
    }

    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
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

          if (done) return onText(fullText)

          const delta = decodeResponse(value)

          if (delta) {
            fullText += delta
            onText(fullText.trim())
          }

          await read()
        }

        await read()

        setFullText(fullText)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [inputMessages])

  return { partialText, fullText, setInputMessages }
}
