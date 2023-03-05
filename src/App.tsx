import Header from '@components/Header/Header'
import { useLoadLocalStorage } from '@hooks/useLoadLocalStorage'
import { ApiResponse } from '@models/api-response.model'
import { Message, Role } from '@models/chat.model'
import { selectChats, selectCurrentChatId } from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const localStorageLoaded = useLoadLocalStorage()

  const dispatch = useAppDispatch()

  const currentChatId = useAppSelector(selectCurrentChatId)
  const chats = useAppSelector(selectChats)
  const currentChat = chats.find(chat => chat.id === currentChatId)

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

  const handleDeleteChat = (chatId: string) => {
    dispatch({
      type: 'chats/deleteChat',
      payload: chatId,
    })
  }

  const handleSendMessage = async () => {
    const input = document.getElementById('messageInput') as HTMLInputElement
    if (!input.value) return
    dispatch({
      type: 'chats/addMessage',
      payload: {
        role: Role.USER,
        content: input.value,
      },
    })
    input.value = ''
  }

  return (
    <div data-testid={AppTestIds.Container} className="w-100 h-screen">
      <Header />
      <div className="flex h-100">
        {/* Sidebar */}
        {localStorageLoaded && !!chats.length && (
          <div className="flex flex-col w-1/5 justify-center items-center p-3 border-r">
            {currentChat && (
              <button onClick={handleCreateChat}>Create Chat</button>
            )}
            <h1 className="text-2xl">Chats</h1>
            <div className="flex flex-col w-100 h-100 justify-center items-center ">
              {chats.map(chat => (
                <div key={chat.id} className="flex">
                  <button onClick={() => handleLoadChat(chat.id)}>
                    {chat.id}
                  </button>
                  <button onClick={() => handleDeleteChat(chat.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Chat */}
        <div className="flex flex-col w-4/5 h-100 items-center">
          {localStorageLoaded && !currentChat && !!chats.length && (
            <div className="flex flex-col w-100 justify-center items-center">
              <h1 className="text-2xl">Select a chat to start</h1>
              <h2 className="text-xl">
                <button className="text-blue-500" onClick={handleCreateChat}>
                  Or create a new one
                </button>
              </h2>
            </div>
          )}
          {localStorageLoaded && !currentChat && !chats.length && (
            <h2 className="text-xl">
              <button className="text-blue-500" onClick={handleCreateChat}>
                Create a new chat
              </button>
            </h2>
          )}
          {localStorageLoaded && currentChat && (
            // Chat header
            <>
              <h1 className="text-2xl">Chat {currentChat.id}</h1>
              <div className="flex flex-col w-100 h-100">
                {chats
                  .find(chat => chat.id === currentChat.id)
                  ?.messages.map((message, idx) => (
                    <div key={idx}>{message.content}</div>
                  ))}
              </div>
            </>
          )}
          {/* Chat input */}
          {localStorageLoaded && currentChat && (
            <div className="flex">
              <input id="messageInput" type="text" className="border mr-2" />{' '}
              <button className="border p-1" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
