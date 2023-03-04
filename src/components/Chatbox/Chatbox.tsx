import { Message } from '@models/conversation.model'

export type ChatboxProps = {
  messages: Message[]
}

export enum ChatboxTestIds {
  Container = 'chatbox-container',
}

const Chatbox = ({ messages }: ChatboxProps) => {
  return (
    <div data-testid={ChatboxTestIds.Container}>
      {messages.map((message, idx) => {
        return (
          <div key={idx} className="p-4">
            {message.content}
          </div>
        )
      })}
    </div>
  )
}

export default Chatbox
