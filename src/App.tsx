import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useLoadLocalStorage } from '@hooks/useLoadLocalStorage'
import { selectChats } from '@redux/chats/chatsSlice'
import { useAppSelector } from '@redux/hooks'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const localStorageLoaded = useLoadLocalStorage()

  const chats = useAppSelector(selectChats)

  return (
    <div data-testid={AppTestIds.Container} className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidenav />
        <main className="flex-1 bg-white p-4 overflow-y-auto">
          {localStorageLoaded && (
            <div className="flex h-100">{<Chatbox />}</div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
