import { type Message } from '@models/chat.model'
import { ignoreNextTailMessage } from '@redux/chats/chatsActions'
import { selectCurrentChat } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useMemo, useState } from 'react'

export interface TokenControllerProps {
  inputTokens: number
}

export enum TokenControllerTestIds {
  TotalTokens = 'token-controller-total-tokens',
}

const calculateChatTokens = (messages: Message[]) => {
  return messages
    .filter(message => !message.ignored)
    .reduce((acc, message) => acc + message.tokens, 0)
}

const TokenController = ({ inputTokens }: TokenControllerProps) => {
  const MAX_PROMPT_TOKENS = 4096

  const dispatch = useAppDispatch()

  const currentChat = useAppSelector(selectCurrentChat)
  const [colourClass, setColourClass] = useState('text-green-500')

  const currentChatIncomingMessageTokens =
    currentChat?.incomingMessage?.tokens ?? 0

  const currentChatTokens = useMemo(() => {
    return calculateChatTokens(currentChat?.messages ?? [])
  }, [currentChat?.messages])

  const totalTokens = currentChatIncomingMessageTokens + currentChatTokens

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
    if (totalTokens >= MAX_PROMPT_TOKENS && currentChat !== undefined) {
      dispatch(ignoreNextTailMessage(currentChat.id))
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
