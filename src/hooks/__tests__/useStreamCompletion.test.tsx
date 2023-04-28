import { useStreamCompletion } from '@hooks/useStreamCompletion'
import { type Message } from '@models/chat.model'
import { type useAppDispatch } from '@redux/hooks'
import { MOCK_STATE } from '@redux/mocks/state.mock'
import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

const useAppDispatchMock = vi.fn()
const useAppSelectorMock = vi.fn()

vi.mock('@redux/hooks', () => ({
  useAppDispatch: () => useAppDispatchMock,
  useAppSelector: (selector: any) => useAppSelectorMock(selector),
}))

const useStreamFetchMock = vi.fn()

vi.mock('@hooks/useStreamFetch', () => ({
  useStreamFetch: (
    apiKey: string,
    inputMessages: Message[],
    currentChatId: string,
    dispatch: ReturnType<typeof useAppDispatch>,
  ) => ({
    fetchData: () =>
      useStreamFetchMock(apiKey, inputMessages, currentChatId, dispatch),
    abortController: new AbortController(),
  }),
}))

describe('useStreamCompletion', () => {
  it('should set input messages', () => {
    useAppSelectorMock.mockReturnValue('testApiKey')
    const { result } = renderHook(() => useStreamCompletion('testChatId'))
    expect(result.current.setInputMessages).toBeDefined()
    act(() => {
      result.current.setInputMessages([...MOCK_STATE.chats.chats['1'].messages])
    })
    expect(useStreamFetchMock).toHaveBeenCalledWith(
      'testApiKey',
      [...MOCK_STATE.chats.chats['1'].messages],
      'testChatId',
      useAppDispatchMock,
    )
  })

  it('should use env API key if not configured in browser', () => {
    import.meta.env.VITE_OPENAI_API_KEY = 'viteApiKey'
    useAppSelectorMock.mockReturnValue(undefined)
    const { result } = renderHook(() => useStreamCompletion('testChatId'))
    expect(result.current.setInputMessages).toBeDefined()
    act(() => {
      result.current.setInputMessages([...MOCK_STATE.chats.chats['1'].messages])
    })
    expect(useStreamFetchMock).toHaveBeenCalledWith(
      'viteApiKey',
      [...MOCK_STATE.chats.chats['1'].messages],
      'testChatId',
      useAppDispatchMock,
    )
  })
})
