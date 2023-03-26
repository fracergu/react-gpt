import binIcon from '@assets/icons/bin.svg'
import Swal from 'sweetalert2'

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
  const confirmDeletion = async (chatId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This chat will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#b91c1c',
    })

    if (result.isConfirmed) {
      handleDeleteChat(chatId)
    }
  }

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
            void confirmDeletion(chatId)
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
