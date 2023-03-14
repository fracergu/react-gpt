import { FetchStatus } from '@enums/fetchStatus.enum'
import { Message as MessageModel, Role } from '@models/chat.model'
import {
  selectChats,
  selectCurrentChatId,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useRef } from 'react'

import personLight from '@assets/person-light.svg'
import personDark from '@assets/person-dark.svg'
import robotLight from '@assets/robot-light.svg'
import robotDark from '@assets/robot-dark.svg'
import { selectTheme } from '@redux/ui/uiSlice'
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
  const dispatch = useAppDispatch()

  const currentTheme = useAppSelector(selectTheme)
  const fetchStatus = useAppSelector(selectFetchStatus)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fetchStatus === FetchStatus.LOADING) return
    messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [fetchStatus, currentChat])

  const handleCreateChat = () => {
    dispatch({
      type: 'chats/createChat',
    })
  }

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
            <div ref={messagesContainerRef}></div>
          </div>
          <ChatInput />
        </>
      )}
    </div>
  )
}

export default Chatbox
