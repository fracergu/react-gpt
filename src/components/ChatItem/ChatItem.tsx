import binIcon from '@assets/icons/bin.svg'
import { useChatsStore } from '@redux/chats/useChatsStore'
import Swal from 'sweetalert2'

export interface ChatItemProps {
  chatId: string
  currentChatId: string | undefined
  createdAt: string
}

const ChatItem = ({ chatId, currentChatId, createdAt }: ChatItemProps) => {
  const { deleteChat, setCurrentChat } = useChatsStore()

  const handleSetCurrentChat = () => {
    setCurrentChat(chatId)
  }

  const handleDeleteChat = async (chatId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This chat will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#b91c1c',
    })

    if (result.isConfirmed) {
      deleteChat(chatId)
    }
  }

  return (
    <div
      className={`flex justify-between items-center 
    ${
      chatId === currentChatId
        ? 'bg-slate-700'
        : 'bg-slate-800 hover:bg-slate-700 hover:shadow'
    }
    transition-colors duration-3 `}
    >
      <div className="flex justify-between items-center w-full">
        <button
          className="flex text-ellipsis overflow-hidden p-3 pl-4 md:pl-6 whitespace-nowrap w-full "
          onClick={handleSetCurrentChat}
        >
          {createdAt}
        </button>
        <div className="flex w-fit mr-3">
          <button
            onClick={() => {
              void handleDeleteChat(chatId)
            }}
            className="w-6 h-6"
          >
            <img src={binIcon} alt="delete chat" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatItem
