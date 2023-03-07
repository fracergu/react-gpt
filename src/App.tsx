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
    <div data-testid={AppTestIds.Container} className="w-100 h-screen">
      <Header />
      {localStorageLoaded && (
        <div className="flex flex-col h-100 justify-center align-center">
          <div className="flex">
            {!!chats.length && <Sidenav />}
            {<Chatbox />}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
