import Loader from '@components/Loader/Loader'
import { FetchStatus } from '@enums/fetchStatus.enum'
import {
  selectChats,
  selectCurrentChatId,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useState } from 'react'
import sendIcon from '@assets/send.svg'
import { Role } from '@models/chat.model'
import { useStreamCompletion } from '@hooks/useStreamCompletion'

export enum ChatInputTestIds {
  Container = 'chat-input-container',
  Textarea = 'chat-input-textarea',
  SendButton = 'chat-input-send-button',
}

const ChatInput = () => {
  const dispatch = useAppDispatch()

  const chats = useAppSelector(selectChats)
  const currentChatId = useAppSelector(selectCurrentChatId)

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const fetchStatus = useAppSelector(selectFetchStatus)

  const [textareaValue, setTextareaValue] = useState('')
  const { partialText, fullText, setInputMessages } = useStreamCompletion()

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextareaValue(event.target.value)
  }

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    if (!partialText) return
    dispatch({
      type: 'chats/updateChatIncomingMessage',
      payload: {
        role: Role.ASSISTANT,
        content: partialText,
      },
    })
  }, [partialText])

  useEffect(() => {
    if (!fullText) return
    dispatch({
      type: 'chats/updateChatIncomingMessage',
      payload: null,
    })
    dispatch({
      type: 'chats/addMessage',
      payload: {
        role: Role.ASSISTANT,
        content: fullText,
      },
    })
    dispatch({
      type: 'chats/updateFetchStatus',
      payload: FetchStatus.IDLE,
    })
  }, [fullText])

  const handleSendMessage = () => {
    if (!textareaValue || !currentChat) return
    const newMessage = {
      role: Role.USER,
      content: textareaValue,
    }
    dispatch({
      type: 'chats/addMessage',
      payload: newMessage,
    })
    dispatch({
      type: 'chats/updateFetchStatus',
      payload: FetchStatus.LOADING,
    })
    setTextareaValue('')
    setInputMessages([...currentChat.messages, newMessage])
  }

  return (
    <div
      data-testid={ChatInputTestIds.Container}
      className="relative mt-auto flex px-4 py-6 w-full justify-center bg-zinc-800"
    >
      <div className="flex gap-4 w-[90ch]">
        <textarea
          data-testid={ChatInputTestIds.Textarea}
          id="messageInput"
          className="resize-none w-full focus:outline-none p-2  bg-zinc-700 text-gray-200 rounded-md"
          placeholder="Type your message here..."
          value={textareaValue}
          onChange={handleTextareaChange}
          onKeyDown={handleTextareaKeyDown}
        />
        {fetchStatus === FetchStatus.LOADING && <Loader />}
        {fetchStatus === FetchStatus.FAILED ||
          (fetchStatus === FetchStatus.IDLE && (
            <button
              data-testid={ChatInputTestIds.SendButton}
              className="p-1"
              onClick={handleSendMessage}
            >
              <img className="w-10 h-10" src={sendIcon} alt="send" />
            </button>
          ))}
      </div>
    </div>
  )
}

export default ChatInput
