import ChatInput from '@components/ChatInput/ChatInput'
import Message from '@components/Message/Message'
import { useStreamCompletion } from '@hooks/useStreamCompletion'
import { type Chat } from '@models/chat.model'
import { useEffect, useRef } from 'react'

import RegenerateResponse from '../RegenerateResponse/RegenerateResponse'

export interface ChatboxProps {
  currentChat: Chat
}

export enum ChatboxTestIds {
  Container = 'chatbox-container',
}

const Chatbox = ({ currentChat }: ChatboxProps) => {
  const chatIncomingMessage = currentChat?.incomingMessage
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { setInputMessages } = useStreamCompletion(currentChat.id)

  useEffect(() => {
    messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChat.messages, chatIncomingMessage, currentChat.fetchError])

  return (
    <div
      className="flex flex-col w-full flex-1 items-center"
      data-testid={ChatboxTestIds.Container}
    >
      {currentChat !== undefined && (
        <>
          <div className="flex flex-col w-full overflow-y-auto leading-8">
            {currentChat.messages.map(message => (
              <Message message={message} key={message.id} />
            ))}
            {chatIncomingMessage != null && (
              <Message message={chatIncomingMessage} />
            )}
            <div ref={messagesContainerRef}></div>
            {currentChat.fetchError !== undefined && (
              <RegenerateResponse
                setInputMessages={setInputMessages}
                currentChat={currentChat}
              />
            )}
          </div>
          <ChatInput setInputMessages={setInputMessages} />
        </>
      )}
    </div>
  )
}

export default Chatbox
