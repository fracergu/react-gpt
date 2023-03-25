import { selectChats, selectCurrentChat } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

import plusIcon from '@assets/icons/plus.svg'
import { selectSidebarOpen } from '@redux/ui/uiSlice'

import { deleteChat, createChat, loadChat } from '@redux/chats/chatsActions'
import ChatItem from '@components/ChatItem/ChatItem'

import Swal from 'sweetalert2'
import { setSidebarOpen } from '@redux/ui/uiActions'

export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  const chats = useAppSelector(selectChats)
  const currentChat = useAppSelector(selectCurrentChat)
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector(selectSidebarOpen)

  const handleDeleteChat = (chatId: string) => {
    dispatch(deleteChat(chatId))
  }

  const handleCreateChat = () => {
    dispatch(createChat())
  }

  const handleLoadChat = (chatId: string) => {
    dispatch(loadChat(chatId))
  }

  const handleBackdropClick = () => {
    dispatch(setSidebarOpen(false))
  }

  const handleWipeButtonClick = () => {
    Swal.fire({
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
        className={`flex flex-col z-20 min-w-[250px] w-[250px] border-gray-300 h-full bg-blue-800 text-gray-100 z-10 absolute md:relative ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <button
          onClick={handleCreateChat}
          className="flex p-3 items-center justify-between w-full hover:bg-blue-700 transition-colors duration-3"
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
              handleLoadChat={handleLoadChat}
              handleDeleteChat={handleDeleteChat}
              createdAt={new Date(chats[chatId].createdAt).toLocaleString()}
            />
          ))}
        </div>
        <div className="p-3 mt-auto items-center w-full">
          <button onClick={handleWipeButtonClick}>Wipe all data</button>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="absolute z-10 w-full h-full md:hidden"
          onClick={handleBackdropClick}
        ></div>
      )}
    </div>
  )
}

export default Sidenav
