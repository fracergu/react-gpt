import { ApiResponse } from '@models/api-response.model'
import { Conversation, Message, Role } from '@models/conversation.model'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

export function useChat() {
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [conversation, setConversation] = useState<Conversation>({
    id: uuid(),
    messages: [],
  })

  useEffect(() => {
    if (!newMessage) return
    setLoading(true)
    const REQUEST_HEADERS = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: REQUEST_HEADERS,
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages: [
          ...conversation.messages,
          { role: Role.USER, content: newMessage },
        ],
      }),
    })
      .then(response => {
        response.json().then((data: ApiResponse) => {
          setConversation({
            ...conversation,
            messages: [
              ...conversation.messages,
              { role: Role.USER, content: newMessage },
              data.choices[0].message as Message,
            ],
          })
          setLoading(false)
        })
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [newMessage])

  return { conversation, setNewMessage, loading }
}
