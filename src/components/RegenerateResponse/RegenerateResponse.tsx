import { type Chat, type Message } from '@models/chat.model'
import { useChatsStore } from '@redux/chats/useChatsStore'

export enum RegenerateResponseTestIds {
  Container = 'regenerate-response-container',
}

interface RegenerateResponseProps {
  chat: Chat
  setInputMessages: (messages: Message[]) => void
}

const RegenerateResponse = ({
  setInputMessages,
  chat,
}: RegenerateResponseProps) => {
  const { setFetchError, setIncomingMessage, setFetchStatus } = useChatsStore()

  const handleRegenerateResponse = () => {
    if (chat === null) return
    setFetchError(chat.id, null)
    setIncomingMessage(chat.id, null)
    setFetchStatus(chat.id, 'loading')
    setInputMessages(chat.messages)
  }

  return (
    <div
      data-testid={RegenerateResponseTestIds.Container}
      className="flex w-full justify-center items-center"
    >
      <div className=" max-w-[90ch] border border-red-500 my-6 p-3">
        <h1 className="text-red-500 mt-2">
          {`Something went wrong: ${chat.fetchError ?? 'Unknown error'}`}
        </h1>
        <button
          className="font-bold underline underline-offset-2 text-center w-full m-x-auto"
          onClick={handleRegenerateResponse}
        >
          Regenerate response
        </button>
      </div>
    </div>
  )
}

export default RegenerateResponse
