import { Message as MessageModel } from '@models/chat.model'
import { selectCurrentChat, selectFetchStatus } from '@redux/chats/chatsSlice'
import { useAppSelector } from '@redux/hooks'
import { useEffect, useRef } from 'react'

import ChatInput from '@components/ChatInput/ChatInput'
import Message from '@components/Message/Message'
import { useStreamCompletion } from '@hooks/useStreamCompletion'
import RegenerateResponse from '../RegenerateResponse/RegenerateResponse'

export type ChatboxProps = {
  messages: MessageModel[]
}

export enum ChatboxTestIds {
  Container = 'chatbox-container',
}

const Chatbox = () => {
  const currentChat = useAppSelector(selectCurrentChat)
  const chatIncomingMessage = currentChat?.incomingMessage
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { setInputMessages } = useStreamCompletion()

  useEffect(() => {
    messagesContainerRef.current?.scrollIntoView()
  }, [currentChat])

  return (
    <div
      className="flex flex-col w-full flex-1 items-center"
      data-testid={ChatboxTestIds.Container}
    >
      {currentChat && (
        <>
          <div className="flex flex-col w-full overflow-y-auto leading-8">
            {currentChat.messages.map((message, idx) => (
              <Message message={message} idx={idx} key={idx} />
            ))}
            {chatIncomingMessage && (
              <Message message={chatIncomingMessage} idx={-1} />
            )}
            <div ref={messagesContainerRef}></div>
            {currentChat.fetchError && (
              <RegenerateResponse setInputMessages={setInputMessages} />
            )}
          </div>
          <ChatInput setInputMessages={setInputMessages} />
        </>
      )}
    </div>
  )
}

export default Chatbox
