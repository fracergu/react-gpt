export type Chat = {
  id: string
  messages: Message[]
  incomingMessage?: Message
}

export type Message = {
  role: Role
  content: string
}

export enum Role {
  ASSISTANT = 'assistant',
  USER = 'user',
}
