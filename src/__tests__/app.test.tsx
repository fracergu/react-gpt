import { ApiKeyPromptTestIds } from '@components/ApiKeyPrompt/ApiKeyPrompt'
import { SidenavTestIds } from '@components/Sidenav/Sidenav'
import * as hooks from '@hooks/useLocalApiKeyHandler'
import App from 'src/App'
import { renderWithProviders } from 'src/utils/test-utils'
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
})
