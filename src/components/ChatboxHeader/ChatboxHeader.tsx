import { useAppDispatch } from '@redux/hooks'

export enum ChatboxHeaderTestIds {
  Container = 'chatbox-header-container',
}

interface ChatboxHeaderProps {
  currentChatId?: string
}

const ChatboxHeader = ({ currentChatId }: ChatboxHeaderProps) => {
  const dispatch = useAppDispatch()

  const handleCreateChat = () => {
    dispatch({
      type: 'chats/createChat',
    })
  }

  const content = currentChatId ? (
    <>Chat {currentChatId}</>
  ) : (
    <>
      Select{' '}
      <a
        className="hover:cursor-pointer underline underline-offset-4"
        onClick={handleCreateChat}
      >
        or create
      </a>{' '}
      a chat to start
    </>
  )

  return (
    <div
      data-testid={ChatboxHeaderTestIds.Container}
      className="flex p-3 w-full justify-center items-center  min-h-[4em] bg-blue-700"
    >
      <span className="text-xl">{content}</span>
    </div>
  )
}

export default ChatboxHeader
