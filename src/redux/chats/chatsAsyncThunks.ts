import { ApiResponse } from '@models/api-response.model'
import { Message } from '@models/chat.model'
import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

export const fetchResponse = createAsyncThunk(
  'chats/fetchResponse',
  async (messages: Message[]) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        messages,
      }),
    })
    const data: ApiResponse = await response.json()
    return data.choices[0].message
  },
)
