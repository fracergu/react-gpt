export type Chats = Record<string, Chat>

export type FetchStatus = 'idle' | 'loading' | 'failed'

export type Role = 'assistant' | 'user'

export interface Chat {
  id: string
  messages: Message[]
  createdAt: number
  incomingMessage: Message | null
  fetchError: string | null
  fetchStatus: FetchStatus
}

export interface Message {
  id: string
  role: Role
  content: string
  tokens: number
  ignored: boolean
}
