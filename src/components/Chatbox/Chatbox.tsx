import ChatInput from '@components/ChatInput/ChatInput'
import Message from '@components/Message/Message'
import { useStreamCompletion } from '@hooks/useStreamCompletion'
import { type Chat } from '@models/chat.model'
import { useEffect, useRef } from 'react'

import RegenerateResponse from '../RegenerateResponse/RegenerateResponse'

export interface ChatboxProps {
  chat: Chat
}

export enum ChatboxTestIds {
  Container = 'chatbox-container',
}

const Chatbox = ({ chat }: ChatboxProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { setInputMessages } = useStreamCompletion()

  useEffect(() => {
    messagesContainerRef.current?.scrollIntoView()
  }, [chat.messages, chat.incomingMessage, chat.fetchError])

  return (
    <div
      className="flex flex-col w-full flex-1 items-center border-l border-t border-slate-700"
      data-testid={ChatboxTestIds.Container}
    >
      <div className="flex flex-col w-full overflow-y-auto leading-8">
        {chat.messages.map(message => (
          <Message message={message} key={message.id} />
        ))}
        {chat.incomingMessage != null && (
          <Message message={chat.incomingMessage} />
        )}
        <div ref={messagesContainerRef}></div>
        {chat.fetchError !== null && (
          <RegenerateResponse setInputMessages={setInputMessages} chat={chat} />
        )}
      </div>
      <ChatInput setInputMessages={setInputMessages} chat={chat} />
    </div>
  )
}

export default Chatbox
