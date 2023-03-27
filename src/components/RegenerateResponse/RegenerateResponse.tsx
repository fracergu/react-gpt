import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Message } from '@models/chat.model'
import {
  updateChatFetchError,
  updateChatIncomingMessage,
  updateFetchStatus,
} from '@redux/chats/chatsActions'
import { selectCurrentChat } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

export enum RegenerateResponseTestIds {
  Container = 'regenerate-response-container',
}

interface RegenerateResponseProps {
  setInputMessages: (messages: Message[]) => void
}

const RegenerateResponse = ({ setInputMessages }: RegenerateResponseProps) => {
  const dispatch = useAppDispatch()

  const currentChat = useAppSelector(selectCurrentChat)

  const handleRegenerateResponse = () => {
    if (currentChat === undefined) return
    dispatch(updateChatIncomingMessage(currentChat.id, null))
    dispatch(updateChatFetchError(currentChat.id, undefined))
    dispatch(updateFetchStatus(FetchStatus.LOADING))
    setInputMessages(currentChat?.messages)
  }

  return (
    <div
      data-testid={RegenerateResponseTestIds.Container}
      className="flex w-full justify-center items-center"
    >
      <div className=" max-w-[90ch] border border-red-500 my-6 p-3">
        <h1 className="text-red-500 mt-2">
          {`Something went wrong: ${
            currentChat?.fetchError ?? 'Unknown error'
          }`}
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
