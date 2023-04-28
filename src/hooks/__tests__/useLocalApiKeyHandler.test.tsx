import { useLocalApiKeyHandler } from '@hooks/useLocalApiKeyHandler'
import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

const useAppDispatchMock = vi.fn()

vi.mock('@redux/hooks', () => ({
  useAppDispatch: () => useAppDispatchMock,
}))

const setApiKeyActionMock = vi.fn()

vi.mock('@redux/ui/uiActions', () => ({
  setApiKey: (apiKey: string) => setApiKeyActionMock(apiKey),
}))

describe('useLocalApiKeyHandler', () => {
  it('should set api key', () => {
    const { result } = renderHook(() => useLocalApiKeyHandler())
    expect(result.current.apiKey).toBeNull()
    act(() => {
      result.current.setApiKey('test')
    })
    expect(result.current.apiKey).toEqual('test')
    expect(useAppDispatchMock).toHaveBeenCalledWith(setApiKeyActionMock('test'))
  })

  it('should set api key from local storage', () => {
    localStorage.setItem('ui', JSON.stringify({ apiKey: 'testApiKey' }))
    const { result } = renderHook(() => useLocalApiKeyHandler())
    expect(result.current.apiKey).toBe('testApiKey')
    expect(useAppDispatchMock).toHaveBeenCalledWith(
      setApiKeyActionMock('testApiKey'),
    )
  })
})
