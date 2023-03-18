import { FetchStatus } from '@enums/fetchStatus.enum'
import { Message as MessageModel } from '@models/chat.model'
import {
  selectChats,
  selectCurrentChatId,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useRef } from 'react'

import ChatInput from '@components/ChatInput/ChatInput'
import Message from '@components/Message/Message'
import ChatboxHeader from '@components/ChatboxHeader/ChatboxHeader'

export type ChatboxProps = {
  messages: MessageModel[]
}

export enum ChatboxTestIds {
  Container = 'chatbox-container',
}

const Chatbox = () => {
  const currentChatId = useAppSelector(selectCurrentChatId)
  const chats = useAppSelector(selectChats)
  const currentChat = chats.find(chat => chat.id === currentChatId)
  const chatIncomingMessage = currentChat?.incomingMessage

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesContainerRef.current?.scrollIntoView()
  }, [currentChat])

  return (
    <div
      className="flex flex-col flex-1 w-4/5 h-100 items-center"
      data-testid={ChatboxTestIds.Container}
    >
      <ChatboxHeader currentChatId={currentChatId} />
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
          </div>
          <ChatInput />
        </>
      )}
    </div>
  )
}

export default Chatbox
