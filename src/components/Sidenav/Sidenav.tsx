import { selectChats, selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

import binIconLight from '@assets/bin-light.svg'
import binIconDark from '@assets/bin-dark.svg'
import { Theme } from '@enums/theme.enum'
import { selectTheme } from '@redux/ui/uiSlice'

import plusIconDark from '@assets/plus-dark.svg'
import plusIconLight from '@assets/plus-light.svg'

export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  const currentChatId = useAppSelector(selectCurrentChatId)
  const chats = useAppSelector(selectChats)
  const currentChat = chats.find(chat => chat.id === currentChatId)
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)

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
      className="flex flex-col w-1/5 border-r border-gray-300 h-100 dark:bg-gray-700 bg-gray-100 dark:border-gray-700 dark:text-gray-200"
      style={{ resize: 'horizontal' }}
    >
      <div className="flex p-3 justify-between items-center border-b border-gray-300 dark:border-gray-700 min-h-[4em]">
        <span className="text-xl">Chats</span>
        <button
          onClick={handleCreateChat}
          style={{ width: '30px', height: '30px', background: 'none' }}
        >
          <img src={theme === Theme.LIGHT ? plusIconLight : plusIconDark} />
        </button>
      </div>
      <div className="overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`flex justify-between items-center even:bg-gray-100 dark:even:bg-gray-700 odd:bg-gray-200 dark:odd:bg-gray-800 ${
              chat.id === currentChat?.id
                ? 'dark:text-green-400 text-green-700'
                : ''
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
              <img src={theme === Theme.LIGHT ? binIconLight : binIconDark} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidenav
