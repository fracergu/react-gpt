import { ApiResponse } from '@models/api-response.model'
import { Chat, Message, Role } from '@models/chat.model'
import { selectChats, selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

export function useChat() {
  const dispatch = useAppDispatch()

  const currentChatId = useAppSelector(selectCurrentChatId)
  const chats = useAppSelector(selectChats)

  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [conversation, setConversation] = useState<Chat>(
    chats.find(chat => chat.id === currentChatId) || {
      id: uuid(),
      messages: [],
    },
  )

  dispatch({ type: 'chats/setCurrentChatId', payload: conversation.id })

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
          const message = data.choices[0].message
          console.log(message)
          setConversation({
            ...conversation,
            messages: [
              ...conversation.messages,
              { role: Role.USER, content: newMessage },
              message as Message,
            ],
          })
          console.log(conversation)
          dispatch({
            type: 'chats/setChats',
            payload: [
              ...chats.filter(chat => chat.id !== conversation.id),
              conversation,
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

  return { setNewMessage, loading, conversation }
}
