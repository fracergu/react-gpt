import Chatbox from '@components/Chatbox/Chatbox'
import Header from '@components/Header/Header'
import { useChat } from '@hooks/useChat'

export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  const { conversation, setNewMessage, loading } = useChat()
  function handleSendButtonClick() {
    const messageInput = document.getElementById(
      'messageInput',
    ) as HTMLInputElement
    const message = messageInput.value
    if (!message) return
    setNewMessage(message)
    messageInput.value = ''
  }

  return (
    <div data-testid={AppTestIds.Container} className="w-100">
      <Header />
      <div className="flex h-100">
        {conversation && <Chatbox messages={conversation.messages} />}
        <input id="messageInput" type="text" className="border" />
        <button
          className={`border ${loading ? 'anumate-spin' : ''}`}
          onClick={handleSendButtonClick}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
