import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import Sidenav from '@components/Sidenav/Sidenav'
import { useMobileUiController } from '@hooks/useMobileUiController'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const dispatch = useDispatch()
  const isMobile = useMobileUiController()

  useEffect(() => {
    dispatch({ type: 'ui/setIsMobile', payload: isMobile })
  }, [isMobile])

  return (
    <div
      data-testid={AppTestIds.Container}
      className="flex flex-col h-screen bg-zinc-900  text-gray-100"
    >
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidenav />
        <Chatbox />
      </div>
    </div>
  )
}

export default App
