import Loader from '@components/Loader/Loader'
import { FetchStatus } from '@enums/fetchStatus.enum'
import { Message, Role } from '@models/chat.model'
import { fetchResponse } from '@redux/chats/chatsAsyncThunks'
import {
  selectChats,
  selectCurrentChatId,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'

import personLight from '@assets/person-light.svg'
import personDark from '@assets/person-dark.svg'
import robotLight from '@assets/robot-light.svg'
import robotDark from '@assets/robot-dark.svg'
import sendLight from '@assets/send-light.svg'
import sendDark from '@assets/send-dark.svg'
import { selectTheme } from '@redux/ui/uiSlice'

export type ChatboxProps = {
  messages: Message[]
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

  const [sendNewMessage, setSendNewMessage] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  const handleTextareaKeyDown: KeyboardEventHandler<
    HTMLTextAreaElement
  > = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      setSendNewMessage(textareaValue.trim())
      setTextareaValue('')
    }
  }

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextareaValue(event.target.value)
  }

  useEffect(() => {
    if (fetchStatus === FetchStatus.LOADING) return
    messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [fetchStatus, currentChat])

  useEffect(() => {
    if (!currentChat) return
    dispatch(fetchResponse(currentChat.messages))
    messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sendNewMessage])

  const handleCreateChat = () => {
    dispatch({
      type: 'chats/createChat',
    })
  }

  const handleSendMessage = async () => {
    if (!textareaValue) return
    await dispatch({
      type: 'chats/addMessage',
      payload: {
        role: Role.USER,
        content: textareaValue,
      },
    })
    setSendNewMessage(textareaValue)
    setTextareaValue('')
  }

  return (
    <div
      className="flex flex-col flex-1 w-4/5 h-100 items-center"
      data-testid={ChatboxTestIds.Container}
    >
      {/* Header */}
      <div className="flex p-3 w-full justify-center items-center border-b dark:border-gray-700 min-h-[4em] dark:bg-gray-700 bg-gray-100">
        <span className="text-xl">
          {currentChat ? (
            <>Chat {currentChat?.id}</>
          ) : (
            <>
              Select{' '}
              <a
                className="text-green-400 hover:cursor-pointer"
                onClick={handleCreateChat}
              >
                or create
              </a>{' '}
              a chat to start
            </>
          )}
        </span>
      </div>

      {/* Conversation */}
      {currentChat && (
        <div className="flex flex-col w-full overflow-y-auto leading-8">
          {currentChat.messages.map((message, idx) => (
            <div
              key={idx}
              className="w-full even:bg-gray-100 dark:even:bg-gray-700 odd:bg-gray-200 dark:odd:bg-gray-800"
            >
              <div className="flex px-4 py-6 max-w-[90ch] my-0 mx-auto">
                <img
                  className="w-6 h-6 mr-6 mt-1"
                  src={
                    message.role === Role.USER
                      ? currentTheme === 'light'
                        ? personLight
                        : personDark
                      : currentTheme === 'light'
                      ? robotLight
                      : robotDark
                  }
                  alt="user"
                />
                <div>{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesContainerRef}></div>
        </div>
      )}
      {/* Input */}
      {currentChat && (
        <div className="flex px-4 py-6 w-full justify-center">
          <div className="flex gap-4 w-[90ch]">
            <textarea
              id="messageInput"
              className="resize-none w-full focus:outline-none p-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Type your message here..."
              value={textareaValue}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
            />
            {fetchStatus === FetchStatus.LOADING && <Loader />}
            {fetchStatus === FetchStatus.FAILED ||
              (fetchStatus === FetchStatus.IDLE && (
                <button className="p-1" onClick={handleSendMessage}>
                  <img
                    className="w-10 h-10"
                    src={currentTheme === 'light' ? sendLight : sendDark}
                    alt="send"
                  />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbox
