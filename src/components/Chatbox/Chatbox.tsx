import ChatInput from '@components/ChatInput/ChatInput'
import Message from '@components/Message/Message'
import { useStreamCompletion } from '@hooks/useStreamCompletion'
import { type Chat, type Message as MessageModel } from '@models/chat.model'
import { selectCurrentChat } from '@redux/chats/chatsSlice'
import { useAppSelector } from '@redux/hooks'
import { useEffect, useRef } from 'react'

import RegenerateResponse from '../RegenerateResponse/RegenerateResponse'

export interface ChatboxProps {
  messages: MessageModel[]
}

export enum ChatboxTestIds {
  Container = 'chatbox-container',
}

const Chatbox = () => {
  const currentChat: Chat | undefined = useAppSelector(selectCurrentChat)
  const chatIncomingMessage = currentChat?.incomingMessage
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { setInputMessages } = useStreamCompletion()

  useEffect(() => {
    if (currentChat != null) {
      messagesContainerRef.current?.scrollIntoView()
    }
  }, [currentChat?.messages, chatIncomingMessage, currentChat?.fetchError])

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
