import ApiKeyPrompt from '@components/ApiKeyPrompt/ApiKeyPrompt'
import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useLocalApiKeyHandler } from '@hooks/useLocalApiKeyHandler'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const { apiKey, setApiKey } = useLocalApiKeyHandler()

  return (
    <div
      data-testid={AppTestIds.Container}
      className="flex flex-col h-screen bg-zinc-900  text-gray-100 transition-all duration-300 ease-in-out"
    >
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
