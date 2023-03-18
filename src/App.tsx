import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useLoadLocalStorage } from '@hooks/useLoadLocalStorage'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const localStorageLoaded = useLoadLocalStorage()

  return (
    <div
      data-testid={AppTestIds.Container}
      className="flex flex-col h-screen bg-zinc-900  text-gray-200"
    >
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidenav />
        {localStorageLoaded && <Chatbox />}
      </div>
    </div>
  )
}

export default App
