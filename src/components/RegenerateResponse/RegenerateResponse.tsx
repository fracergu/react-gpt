import { FetchStatus } from '@enums/fetchStatus.enum'
import { Message } from '@models/chat.model'
import { selectCurrentChat } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

export enum RegenerateResponseTestIds {
  Container = 'regenerate-response-container',
}

type RegenerateResponseProps = {
  setInputMessages: (messages: Message[]) => void
}

const RegenerateResponse = ({ setInputMessages }: RegenerateResponseProps) => {
  const dispatch = useAppDispatch()

  const currentChat = useAppSelector(selectCurrentChat)

  const handleRegenerateResponse = () => {
    if (!currentChat) return
    dispatch({
      type: 'chats/updateChatIncomingMessage',
      payload: null,
    })
    dispatch({
      type: 'chats/updateFetchStatus',
      payload: FetchStatus.LOADING,
    })
    setInputMessages(currentChat.messages)
  }

  return (
    <div data-testid={RegenerateResponseTestIds.Container}>
      <h1 className="text-red-500 text-center mt-2">
        {`Something went wrong: ${currentChat?.fetchError}`}
      </h1>
      <button
        className="font-bold underline underline-offset-2 text-center w-full m-x-auto"
        onClick={handleRegenerateResponse}
      >
        Regenerate response
      </button>
    </div>
  )
}

export default RegenerateResponse
