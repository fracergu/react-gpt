import ApiKeyPrompt from '@components/ApiKeyPrompt/ApiKeyPrompt'
import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useLocalApiKeyHandler } from '@hooks/useLocalApiKeyHandler'
import { selectCurrentChat } from '@redux/chats/chats.slice'
import { useAppSelector } from '@redux/hooks'

function App() {
  const { apiKey, setApiKey } = useLocalApiKeyHandler()
  const currentChat = useAppSelector(selectCurrentChat)

  return (
    <div className="flex flex-col h-screen bg-slate-900  text-white transition-all duration-300 ease-in-out">
      <Header />
      {apiKey === null ? (
        <ApiKeyPrompt updateApiKey={setApiKey} />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          <Sidenav />
          {currentChat !== undefined && <Chatbox currentChat={currentChat} />}
        </div>
      )}
    </div>
  )
}

export default App
