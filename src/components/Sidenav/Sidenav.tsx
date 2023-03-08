import { selectChats, selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

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
      className="flex flex-col w-1/5 justify-center items-center p-3 border-r"
    >
      {currentChat && <button onClick={handleCreateChat}>Create Chat</button>}
      <h1 className="text-2xl">Chats</h1>
      <div className="flex flex-col w-100 h-100 justify-center items-center ">
        {chats.map(chat => (
          <div key={chat.id} className="flex">
            <button onClick={() => handleLoadChat(chat.id)}>{chat.id}</button>
            <button onClick={() => handleDeleteChat(chat.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidenav
