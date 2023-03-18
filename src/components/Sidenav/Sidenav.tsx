import { selectChats, selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

import binIcon from '@assets/bin.svg'
import plusIcon from '@assets/plus.svg'

export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  const currentChatId = useAppSelector(selectCurrentChatId)
  const chats = useAppSelector(selectChats)
  const currentChat = chats.find(chat => chat.id === currentChatId)
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
      className="flex flex-col w-1/5 border-r border-gray-300 h-100 bg-gray-700 border-gray-700 text-gray-200"
      style={{ resize: 'horizontal' }}
    >
      <div className="flex p-3 justify-between items-center border-b border-gray-700 min-h-[4em]">
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
            className={`flex justify-between items-center even:bg-gray-700 odd:bg-gray-800 ${
              chat.id === currentChat?.id ? 'text-green-400' : ''
            }`}
          >
            <button
              style={{ maxWidth: '100%' }}
              className="text-ellipsis overflow-hidden whitespace-nowrap w-100 p-3 pr-0"
              onClick={() => handleLoadChat(chat.id)}
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
