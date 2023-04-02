import ApiKeyPrompt from '@components/ApiKeyPrompt/ApiKeyPrompt'
import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useLocalApiKeyHandler } from '@hooks/useLocalApiKeyHandler'
import { useChatsStore } from '@redux/chats/useChatsStore'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const { apiKey, setApiKey } = useLocalApiKeyHandler()

  const { currentChat } = useChatsStore(state => ({
    currentChat:
      state.currentChat !== null ? state.chats[state.currentChat] : null,
  }))

  return (
    <div
      data-testid={AppTestIds.Container}
      className="flex flex-col h-screen bg-slate-900  text-white transition-all duration-300 ease-in-out"
    >
      <Header />
      {apiKey === null ? (
        <ApiKeyPrompt updateApiKey={setApiKey} />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          <Sidenav />
          {currentChat !== null && <Chatbox chat={currentChat} />}
        </div>
      )}
    </div>
  )
}

export default App
