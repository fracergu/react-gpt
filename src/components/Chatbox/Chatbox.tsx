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
import { useEffect, useState } from 'react'

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

  const fetchStatus = useAppSelector(selectFetchStatus)

  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (!currentChat) return
    dispatch(fetchResponse(currentChat.messages))
  }, [newMessage])

  const handleCreateChat = () => {
    dispatch({
      type: 'chats/createChat',
    })
  }

  const handleSendMessage = async () => {
    const input = document.getElementById('messageInput') as HTMLInputElement
    if (!input.value) return
    await dispatch({
      type: 'chats/addMessage',
      payload: {
        role: Role.USER,
        content: input.value,
      },
    })
    setNewMessage(input.value)
    input.value = ''
  }

  return (
    <div
      className="flex flex-col w-4/5 h-100 items-center"
      data-testid={ChatboxTestIds.Container}
    >
      {!currentChat && (
        <div>
          {chats.length > 0 && (
            <h1 className="text-2xl">Select a chat to start or</h1>
          )}
          <h2 className="text-xl">
            <button className="text-blue-500" onClick={handleCreateChat}>
              Create a new one
            </button>
          </h2>
        </div>
      )}
      {currentChat && (
        <div>
          <h1>Chat {currentChat.id}</h1>
          <div className="flex flex-col">
            {currentChat.messages.map((message, idx) => {
              switch (message.role) {
                case Role.USER:
                  return (
                    <div
                      key={idx}
                      className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800"
                    >
                      <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                        <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  )
                case Role.ASSISTANT:
                  return (
                    <div
                      key={idx}
                      className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]"
                    >
                      <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                        <div className="flex flex-grow flex-col gap-3">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  )
              }
            })}
          </div>
        </div>
      )}
      {currentChat && (
        <div className="flex">
          <input id="messageInput" type="text" className="border mr-2" />
          {fetchStatus === FetchStatus.LOADING && <Loader />}
          {fetchStatus === FetchStatus.FAILED ||
            (fetchStatus === FetchStatus.IDLE && (
              <button className="border p-1" onClick={handleSendMessage}>
                Send
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default Chatbox
