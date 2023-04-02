import sendIcon from '@assets/icons/send.svg'
import Loader from '@components/Loader/Loader'
import TokenController from '@components/TokenController/TokenController'
import { type Chat, type Message, type Role } from '@models/chat.model'
import { useChatsStore } from '@redux/chats/useChatsStore'
import { useCallback, useState } from 'react'
import { getTokenAmount } from 'src/utils/tokens-utils'
import { v4 as uuid } from 'uuid'

interface chatInputProps {
  chat: Chat
  setInputMessages: (messages: Message[]) => void
}

const ChatInput = ({ setInputMessages, chat }: chatInputProps) => {
  const { addMessage } = useChatsStore()
  const [textareaValue, setTextareaValue] = useState('')
  const [currentInputTokens, setCurrentInputTokens] = useState<number>(0)

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextareaValue(event.target.value)
    setCurrentInputTokens(getTokenAmount(event.target.value))
  }

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
      setCurrentInputTokens(0)
    }
  }

  const handleSendMessage = useCallback(() => {
    if (textareaValue.length === 0) return
    const newMessage = {
      id: uuid(),
      role: 'user' as Role,
      content: textareaValue,
      tokens: currentInputTokens,
      ignored: false,
    }

    addMessage(chat.id, newMessage)
    setTextareaValue('')
    setInputMessages([...chat.messages, newMessage])
  }, [chat, textareaValue, setInputMessages, addMessage])

  return (
    <div className="relative mt-auto flex px-4 pb-6 w-full justify-center bg-slate-800 border-t border-slate-700">
      <div className="w-full max-w-[90ch]">
        <div className="py-3 md:pr-[60px]">
          <TokenController inputTokens={currentInputTokens} chat={chat} />
        </div>
        <div className="flex gap-4 w-full max-w-[90ch]">
          <div className="flex flex-col w-full">
            <textarea
              id="messageInput"
              className="resize-none w-full focus:outline-none p-2 bg-slate-700 text-gray-100 rounded-md"
              placeholder="Type your message here..."
              value={textareaValue}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
              disabled={chat.fetchStatus === 'loading'}
            />
          </div>
          {chat.fetchStatus === 'loading' && <Loader />}
          {chat.fetchStatus !== 'loading' && (
            <button className="p-1" onClick={handleSendMessage}>
              <img className="w-10 h-10" src={sendIcon} alt="send" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput
