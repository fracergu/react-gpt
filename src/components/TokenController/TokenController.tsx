import { type Chat, type Message } from '@models/chat.model'
import { useChatsStore } from '@redux/chats/useChatsStore'
import { useUiStore } from '@redux/ui/useUiStore'
import { useEffect, useMemo, useState } from 'react'

export interface TokenControllerProps {
  chat: Chat
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

const TokenController = ({ inputTokens, chat }: TokenControllerProps) => {
  const MAX_PROMPT_TOKENS = 4096

  const { setNextTailMessageIgnored } = useChatsStore()
  const { autoPromptCleanup, toggleAutoPromptCleanup } = useUiStore()

  const [colourClass, setColourClass] = useState('text-green-500')

  const currentChatIncomingMessageTokens =
    chat.incomingMessage !== null ? chat.incomingMessage.tokens : 0

  const currentChatTokens = useMemo(() => {
    return calculateChatTokens(chat.messages ?? [])
  }, [chat.messages])

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
    if (Boolean(autoPromptCleanup) && totalTokens >= MAX_PROMPT_TOKENS) {
      setNextTailMessageIgnored(chat.id)
    }
  }, [totalTokens, autoPromptCleanup])

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
      <div>
        <input
          type="checkbox"
          id="cleanPromptCheckbox"
          className="mr-2"
          onChange={() => {
            toggleAutoPromptCleanup()
          }}
          checked={autoPromptCleanup}
        />
        <label htmlFor="cleanPromptCheckbox">Auto prompt clean</label>
      </div>
    </div>
  )
}

export default TokenController
