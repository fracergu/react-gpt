export type Chats = Record<string, Chat>

export interface Chat {
  id: string
  messages: Message[]
  createdAt: number
  incomingMessage?: Message
  fetchError?: string
}

export interface Message {
  id: string
  role: Role
  content: string
  tokens: number
  ignored: boolean
}

export enum Role {
  ASSISTANT = 'assistant',
  USER = 'user',
}
