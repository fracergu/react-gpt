import sendIcon from '@assets/icons/send.svg'
import Loader from '@components/Loader/Loader'
import TokenController from '@components/TokenController/TokenController'
import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Message, Role } from '@models/chat.model'
import { addMessage } from '@redux/chats/chatsActions'
import { selectCurrentChat, selectFetchStatus } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useCallback, useState } from 'react'
import { getTokenAmount } from 'src/utils/tokens-utils'
import { v4 as uuid } from 'uuid'

interface chatInputProps {
  setInputMessages: (messages: Message[]) => void
}

const ChatInput = ({ setInputMessages }: chatInputProps) => {
  const dispatch = useAppDispatch()

  const currentChat = useAppSelector(selectCurrentChat)
  const fetchStatus = useAppSelector(selectFetchStatus)

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
    if (textareaValue.length === 0 || currentChat == null) return
    const newMessage = {
      id: uuid(),
      role: Role.USER,
      content: textareaValue,
      tokens: currentInputTokens,
      ignored: false,
    }

    dispatch(addMessage(currentChat.id, newMessage))

    setTextareaValue('')
    setInputMessages([...currentChat.messages, newMessage])
  }, [currentChat, textareaValue, setInputMessages, dispatch])

  return (
    <div className="relative mt-auto flex px-4 pb-6 w-full justify-center bg-zinc-800 border-t border-zinc-700">
      <div className="w-full max-w-[90ch]">
        <div className="py-3">
          <TokenController inputTokens={currentInputTokens} />
        </div>
        <div className="flex gap-4 w-full max-w-[90ch]">
          <textarea
            id="messageInput"
            className="resize-none w-full focus:outline-none p-2 bg-zinc-700 text-gray-100 rounded-md"
            placeholder="Type your message here..."
            value={textareaValue}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            disabled={fetchStatus === FetchStatus.LOADING}
          />
          {fetchStatus === FetchStatus.LOADING && <Loader />}
          {fetchStatus !== FetchStatus.LOADING && (
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
