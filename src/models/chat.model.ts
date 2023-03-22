export type Chats = {
  [id: string]: Chat
}

export type Chat = {
  id: string
  messages: Message[]
  createdAt: number
  incomingMessage?: Message
  fetchError?: string
}

export type Message = {
  role: Role
  content: string
}

export enum Role {
  ASSISTANT = 'assistant',
  USER = 'user',
}
