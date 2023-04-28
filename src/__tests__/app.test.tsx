import { ApiKeyPromptTestIds } from '@components/ApiKeyPrompt/ApiKeyPrompt'
import { ChatboxTestIds } from '@components/Chatbox/Chatbox'
import { SidenavTestIds } from '@components/Sidenav/Sidenav'
import * as hooks from '@hooks/useLocalApiKeyHandler'
import * as reduxHooks from '@redux/hooks'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { renderWithProviders } from '@utils/test.utils'
import App from 'src/App'
import { vi } from 'vitest'

describe('App', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render Sidenav when API key not null', () => {
    vi.spyOn(hooks, 'useLocalApiKeyHandler').mockReturnValueOnce({
      apiKey: 'some-api-key',
      setApiKey: vi.fn(),
    })
    const { getByTestId } = renderWithProviders(<App />)
    expect(getByTestId(SidenavTestIds.Container)).toBeInTheDocument()
  })

  it('should render ApiKeyPrompt when API key is null', () => {
    vi.spyOn(hooks, 'useLocalApiKeyHandler').mockReturnValueOnce({
      apiKey: null,
      setApiKey: vi.fn(),
    })
    const { getByTestId } = renderWithProviders(<App />)
    expect(getByTestId(ApiKeyPromptTestIds.Container)).toBeInTheDocument()
  })

  it('should not render Chatbox if currentChat is undefined', () => {
    vi.spyOn(hooks, 'useLocalApiKeyHandler').mockReturnValueOnce({
      apiKey: 'some-api-key',
      setApiKey: vi.fn(),
    })
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValueOnce(undefined)
    const { queryByTestId } = renderWithProviders(<App />)
    expect(queryByTestId(ChatboxTestIds.Container)).not.toBeInTheDocument()
  })

  it('should render Chatbox if currentChat is defined', () => {
    vi.spyOn(hooks, 'useLocalApiKeyHandler').mockReturnValueOnce({
      apiKey: 'some-api-key',
      setApiKey: vi.fn(),
    })

    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValueOnce({
      ...MOCK_STATE.chats.chats['1'],
    })

    window.HTMLElement.prototype.scrollIntoView = vi.fn()

    const { queryByTestId } = renderWithProviders(<App />)
    expect(queryByTestId(ChatboxTestIds.Container)).toBeInTheDocument()
  })
})
