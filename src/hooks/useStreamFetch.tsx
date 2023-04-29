import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Message } from '@models/chat.model'
import {
  APIError,
  type APIResponseError,
  NoBodyError,
} from '@models/errors.model'
import {
  updateChatFetchError,
  updateFetchStatus,
} from '@redux/chats/chats.actions'
import { type useAppDispatch } from '@redux/hooks'
import { prepareMessagesForAPI, readStreamResponse } from '@utils/fetch.utils'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_CHAT_MODEL = 'gpt-3.5-turbo'

export const useStreamFetch = (
  apiKey: string,
  inputMessages: Message[],
  currentChatId: string,
  dispatch: ReturnType<typeof useAppDispatch>,
) => {
  const abortController = new AbortController()

  const fetchData = async () => {
    dispatch(updateFetchStatus(FetchStatus.LOADING))

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: prepareMessagesForAPI(inputMessages),
          model: OPENAI_CHAT_MODEL,
          stream: true,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData: APIResponseError = await response.json()
        throw new APIError(errorData)
      }

      if (response.body === null) throw new NoBodyError()

      const reader = response.body.getReader()
      await readStreamResponse(reader, '', currentChatId, dispatch)
    } catch (error: unknown) {
      if (error instanceof APIError || error instanceof NoBodyError) {
        if (currentChatId !== undefined)
          dispatch(updateChatFetchError(currentChatId, error.message))
      }
      abortController.abort()
    }
  }

  return { fetchData, abortController }
}
