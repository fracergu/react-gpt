import {
  selectChats,
  selectCurrentChat,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

import binIcon from '@assets/bin.svg'
import plusIcon from '@assets/plus.svg'
import { FetchStatus } from '@enums/fetchStatus.enum'
import { selectIsMobile, selectSidebarOpen } from '@redux/ui/uiSlice'

export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  const chats = useAppSelector(selectChats)
  const currentChat = useAppSelector(selectCurrentChat)
  const fetchStatus = useAppSelector(selectFetchStatus)
  const isMobile = useAppSelector(selectIsMobile)
  const dispatch = useAppDispatch()

  const sidebarOpen = useAppSelector(selectSidebarOpen)

  const handleDeleteChat = (chatId: string) => {
    dispatch({
      type: 'chats/deleteChat',
      payload: chatId,
    })
  }

  const handleCreateChat = () => {
    dispatch({
      type: 'chats/createChat',
    })
    if (isMobile) {
      dispatch({
        type: 'ui/setSidebarOpen',
        payload: false,
      })
    }
  }

  const handleLoadChat = (chatId: string) => {
    dispatch({
      type: 'chats/loadChat',
      payload: chatId,
    })
    if (isMobile) {
      dispatch({
        type: 'ui/setSidebarOpen',
        payload: false,
      })
    }
  }

  return (
    <div
      data-testid={SidenavTestIds.Container}
      className={`flex flex-col min-w-[250px] w-[250px] border-gray-300 h-full bg-blue-800 text-gray-100 z-10 absolute md:relative ${
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
          <div
            key={chatId}
            className={`flex justify-between items-center 
            ${
              chatId === currentChat?.id
                ? 'bg-blue-700'
                : 'bg-blue-800 hover:bg-blue-700 hover:shadow'
            }
            transition-colors duration-3 `}
          >
            <div className="flex justify-between items-center p-3 w-full">
              <button
                className="flex text-ellipsis overflow-hidden whitespace-nowrap max-w-[75%]"
                onClick={() => handleLoadChat(chatId)}
                disabled={fetchStatus === FetchStatus.LOADING}
              >
                {new Date(chats[chatId].createdAt).toLocaleString()}
              </button>
              <button
                onClick={() => handleDeleteChat(chatId)}
                className="w-6 h-6"
              >
                <img src={binIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidenav
