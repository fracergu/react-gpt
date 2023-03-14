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
        className="text-green-400 hover:cursor-pointer"
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
      className="flex p-3 w-full justify-center items-center border-b dark:border-gray-700 min-h-[4em] dark:bg-gray-700 bg-gray-100"
    >
      <span className="text-xl">{content}</span>
    </div>
  )
}

export default ChatboxHeader
