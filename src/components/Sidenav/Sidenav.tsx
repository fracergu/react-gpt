import {
  selectChats,
  selectCurrentChat,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

import binIcon from '@assets/bin.svg'
import plusIcon from '@assets/plus.svg'
import { FetchStatus } from '@enums/fetchStatus.enum'

export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  const chats = useAppSelector(selectChats)
  const currentChat = useAppSelector(selectCurrentChat)
  const fetchStatus = useAppSelector(selectFetchStatus)
  const dispatch = useAppDispatch()

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
  }

  const handleLoadChat = (chatId: string) => {
    dispatch({
      type: 'chats/loadChat',
      payload: chatId,
    })
  }

  return (
    <div
      data-testid={SidenavTestIds.Container}
      className="flex flex-col w-1/5 border-gray-300 h-100 bg-blue-700 b text-gray-200"
      style={{ resize: 'horizontal' }}
    >
      <div className="flex p-3 justify-between items-center min-h-[4em]">
        <span className="text-xl">Chats</span>
        <button
          onClick={handleCreateChat}
          style={{ width: '30px', height: '30px', background: 'none' }}
        >
          <img src={plusIcon} />
        </button>
      </div>
      <div className="overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`flex justify-between items-center bg-${
              chat.id === currentChat?.id ? 'zinc-900' : 'blue-700'
            }`}
          >
            <button
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[75%] p-3 pr-0"
              onClick={() => handleLoadChat(chat.id)}
              disabled={fetchStatus === FetchStatus.LOADING}
            >
              {chat.id}
            </button>
            <button
              onClick={() => handleDeleteChat(chat.id)}
              className="m-3"
              style={{ width: '30px', height: '30px', background: 'none' }}
            >
              <img src={binIcon} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidenav
