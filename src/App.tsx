import ApiKeyPrompt from '@components/ApiKeyPrompt/ApiKeyPrompt'
import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useLocalApiKeyHandler } from '@hooks/useLocalApiKeyHandler'

function App() {
  const { apiKey, setApiKey } = useLocalApiKeyHandler()

  return (
    <div className="flex flex-col h-screen bg-slate-900  text-white transition-all duration-300 ease-in-out">
      <Header />
      {apiKey === null ? (
        <ApiKeyPrompt updateApiKey={setApiKey} />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          <Sidenav />
          <Chatbox />
        </div>
      )}
    </div>
  )
}

export default App
