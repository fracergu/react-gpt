import { ApiResponse } from '@models/api-response.model'
import { useEffect, useState } from 'react'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

export function useSendMessage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')

  useEffect(() => {
    if (!message) return
    const REQUEST_HEADERS = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: REQUEST_HEADERS,
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages: [message],
      }),
    }).then(response => {
      response.json().then((data: ApiResponse) => {
        const message = data.choices[0].message
        setResponse(message.content)
      })
    })
  }, [message])

  return { response, setMessage }
}
