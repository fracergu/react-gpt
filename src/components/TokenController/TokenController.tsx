import { type Chat, type Message } from '@models/chat.model'
import { ignoreNextTailMessage } from '@redux/chats/chatsActions'
import { useAppDispatch } from '@redux/hooks'
import { useEffect, useMemo, useState } from 'react'

const calculateChatTokens = (messages: Message[]) => {
  return messages
    .filter(message => !message.ignored)
    .reduce((acc, message) => acc + message.tokens, 0)
}

export enum TokenControllerTestIds {
  TotalTokens = 'token-controller-total-tokens',
}
export interface TokenControllerProps {
  inputTokens: number
  currentChat: Chat
}

const TokenController = ({
  inputTokens,
  currentChat,
}: TokenControllerProps) => {
  const MAX_PROMPT_TOKENS = 4096

  const { id: chatId, messages, incomingMessage } = currentChat

  const dispatch = useAppDispatch()

  const [colourClass, setColourClass] = useState('text-green-500')

  const incomingMessageTokens = incomingMessage?.tokens ?? 0

  const chatMessagesTokens = useMemo(() => {
    return calculateChatTokens(currentChat.messages)
  }, [messages])

  const totalTokens = useMemo(() => {
    return chatMessagesTokens + incomingMessageTokens
  }, [chatMessagesTokens, incomingMessageTokens])

  const getColourClass = () => {
    const maxTokens = MAX_PROMPT_TOKENS
    const percent = Math.min(totalTokens / maxTokens, 1)

    if (percent > 0.9) return 'text-red-500'
    if (percent > 0.75) return 'text-orange-500'
    if (percent > 0.5) return 'text-yellow-500'
    return 'text-green-500'
  }

  useEffect(() => {
    setColourClass(getColourClass())
    if (totalTokens >= MAX_PROMPT_TOKENS) {
      dispatch(ignoreNextTailMessage(chatId))
    }
  }, [totalTokens])

  return (
    <div className="flex justify-center md:justify-between">
      <div className="hidden md:inline">
        <span className="mr-2">
          Current prompt tokens:{' '}
          <span
            data-testid={TokenControllerTestIds.TotalTokens}
            className={colourClass}
          >
            {totalTokens}
          </span>
        </span>
        <span>Input tokens: {inputTokens}</span>
      </div>
    </div>
  )
}

export default TokenController
