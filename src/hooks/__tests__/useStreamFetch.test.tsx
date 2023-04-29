import { useStreamFetch } from '@hooks/useStreamFetch'
import { type Message } from '@models/chat.model'
import { updateChatFetchError } from '@redux/chats/chats.actions'
import { renderHook } from '@testing-library/react'
import { prepareMessagesForAPI, readStreamResponse } from '@utils/fetch.utils'
import { type SpyInstance, vi } from 'vitest'

const useAppDispatchMock = vi.fn()
const apiKey = 'test-api-key'
const inputMessages: Message[] = []
const currentChatId = 'test-chat-id'

const API_URL = 'https://api.openai.com/v1/chat/completions'

const updateFetchStatusMock = vi.fn()
const updateChatFetchErrorMock = vi.fn()

describe('useStreamFetch', () => {
  let mockFetch: SpyInstance

  beforeEach(() => {
    mockFetch = vi.spyOn(global, 'fetch')
    vi.mock('@redux/hooks', () => ({
      useAppDispatch: () => useAppDispatchMock,
    }))
    vi.mock('@utils/fetch.utils', () => ({
      prepareMessagesForAPI: vi.fn(),
      readStreamResponse: vi.fn(),
    }))
    vi.mock('@redux/chats/chats.actions', () => ({
      updateFetchStatus: () => updateFetchStatusMock,
      updateChatFetchError: () => updateChatFetchErrorMock,
    }))
  })

  afterEach(() => {
    mockFetch.mockRestore()
  })

  it('should call fetch with correct parameters and handle successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({}),
      },
    })

    const { result } = renderHook(() =>
      useStreamFetch(apiKey, inputMessages, currentChatId, useAppDispatchMock),
    )

    await result.current.fetchData()

    expect(global.fetch).toHaveBeenCalledWith(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: prepareMessagesForAPI(inputMessages),
        model: 'gpt-3.5-turbo',
        stream: true,
      }),
      signal: expect.any(AbortSignal),
    })

    expect(useAppDispatchMock).toHaveBeenCalledWith(updateFetchStatusMock)

    expect(readStreamResponse).toHaveBeenCalled()
  })

  it('should handle API error response', async () => {
    const errorMessage = 'Test API error'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: errorMessage,
        },
      }),
    })

    const { result } = renderHook(() =>
      useStreamFetch(apiKey, inputMessages, currentChatId, useAppDispatchMock),
    )

    await result.current.fetchData()

    expect(useAppDispatchMock).toHaveBeenCalledWith(
      updateChatFetchError(currentChatId, errorMessage),
    )
  })

  it('should handle response with no body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: null,
    })

    const { result } = renderHook(() =>
      useStreamFetch(apiKey, inputMessages, currentChatId, useAppDispatchMock),
    )

    await result.current.fetchData()

    expect(useAppDispatchMock).toHaveBeenCalledWith(
      updateChatFetchError(currentChatId, 'No body in response'),
    )
  })
})
