export type Chats = Record<string, Chat>

export interface Chat {
  id: string
  messages: Message[]
  createdAt: number
  incomingMessage?: Message
  fetchError?: string
}

export interface Message {
  role: Role
  content: string
}

export enum Role {
  ASSISTANT = 'assistant',
  USER = 'user',
}
