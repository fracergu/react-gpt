import binIcon from '@assets/icons/bin.svg'

export interface ChatItemProps {
  chatId: string
  currentChatId: string | undefined
  handleLoadChat: (chatId: string) => void
  handleDeleteChat: (chatId: string) => void
  createdAt: string
}

const ChatItem = ({
  chatId,
  currentChatId,
  handleLoadChat,
  handleDeleteChat,
  createdAt,
}: ChatItemProps) => {
  return (
    <div
      className={`flex justify-between items-center 
    ${
      chatId === currentChatId
        ? 'bg-blue-700'
        : 'bg-blue-800 hover:bg-blue-700 hover:shadow'
    }
    transition-colors duration-3 `}
    >
      <div className="flex justify-between items-center p-3 w-full">
        <button
          className="flex text-ellipsis overflow-hidden whitespace-nowrap max-w-[75%]"
          onClick={() => {
            handleLoadChat(chatId)
          }}
        >
          {createdAt}
        </button>
        <button
          onClick={() => {
            handleDeleteChat(chatId)
          }}
          className="w-6 h-6"
        >
          <img src={binIcon} alt="delete chat" />
        </button>
      </div>
    </div>
  )
}

export default ChatItem
