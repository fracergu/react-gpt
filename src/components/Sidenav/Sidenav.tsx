import plusIcon from '@assets/icons/plus.svg'
import ChatItem from '@components/ChatItem/ChatItem'
import { useChatsStore } from '@redux/chats/useChatsStore'
import { useUiStore } from '@redux/ui/useUiStore'
import Swal from 'sweetalert2'

export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  const { currentChat } = useChatsStore(state => ({
    currentChat:
      state.currentChat !== null ? state.chats[state.currentChat] : null,
  }))

  const { chats, createChat } = useChatsStore()
  const { isSidebarOpen, setSidebarOpen } = useUiStore()

  const handleWipeButtonClick = () => {
    void Swal.fire({
      title: 'Are you sure?',
      text: 'Your chats and API key (if set) will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#b91c1c',
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.clear()
        window.location.reload()
      }
    })
  }

  return (
    <div className="flex">
      <div
        data-testid={SidenavTestIds.Container}
        className={`flex flex-col z-20 min-w-[250px] w-[250px] border-gray-300 h-full bg-slate-800 text-gray-100 z-10 absolute md:relative ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <button
          onClick={createChat}
          className="flex p-3 pl-4 md:pl-6 items-center justify-between w-full hover:bg-slate-700 transition-colors duration-3"
        >
          <span className="text-sm">Create new chat</span>
          <img src={plusIcon} className="w-6 h-6" />
        </button>
        <div className="overflow-y-auto text-sm">
          {Object.keys(chats).map(chatId => (
            <ChatItem
              key={chatId}
              chatId={chatId}
              currentChatId={currentChat?.id}
              createdAt={new Date(chats[chatId].createdAt).toLocaleString()}
            />
          ))}
        </div>
        <div className="p-3 pl-4 md:pl-6 mt-auto items-center w-full">
          <button onClick={handleWipeButtonClick}>Wipe all data</button>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="absolute z-10 w-full h-full md:hidden"
          onClick={() => {
            setSidebarOpen(false)
          }}
        ></div>
      )}
    </div>
  )
}

export default Sidenav
