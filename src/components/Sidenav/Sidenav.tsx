import plusIcon from '@assets/icons/plus.svg'
import ChatItem from '@components/ChatItem/ChatItem'
import { createChat, deleteChat, loadChat } from '@redux/chats/chatsActions'
import { selectChats, selectCurrentChat } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { setSidebarOpen } from '@redux/ui/uiActions'
import { selectSidebarOpen } from '@redux/ui/uiSlice'
import { useCallback } from 'react'
import Swal from 'sweetalert2'

export enum SidenavTestIds {
  Container = 'sidenav-container',
  Backdrop = 'sidenav-backdrop',
}

const Sidenav = () => {
  const chats = useAppSelector(selectChats)
  const currentChat = useAppSelector(selectCurrentChat)
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector(selectSidebarOpen)

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      dispatch(deleteChat(chatId))
    },
    [dispatch],
  )

  const handleCreateChat = useCallback(() => {
    dispatch(createChat())
  }, [dispatch])

  const handleLoadChat = useCallback(
    (chatId: string) => {
      dispatch(loadChat(chatId))
    },
    [dispatch],
  )

  const handleBackdropClick = useCallback(() => {
    dispatch(setSidebarOpen(false))
  }, [dispatch])

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
    <>
      {sidebarOpen && (
        <div className="flex">
          <div
            data-testid={SidenavTestIds.Container}
            className={`flex flex-col z-20 min-w-[250px] w-[250px] border-gray-300 h-full bg-slate-800 text-gray-100 z-10 border-r border-slate-700 absolute md:relative`}
          >
            <button
              onClick={handleCreateChat}
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
                  handleLoadChat={handleLoadChat}
                  handleDeleteChat={handleDeleteChat}
                  createdAt={new Date(chats[chatId].createdAt).toLocaleString()}
                />
              ))}
            </div>
            <div className="p-3 pl-4 md:pl-6 mt-auto items-center w-full">
              <button onClick={handleWipeButtonClick}>Wipe all data</button>
            </div>
          </div>
          <div
            data-testid={SidenavTestIds.Backdrop}
            className="absolute z-10 w-full h-full md:hidden"
            onClick={handleBackdropClick}
          ></div>
        </div>
      )}
    </>
  )
}

export default Sidenav
