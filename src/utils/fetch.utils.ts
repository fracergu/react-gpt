import { FetchStatus } from '@enums/fetchStatus.enum'
import { type Message, Role } from '@models/chat.model'
import {
  addMessage,
  updateChatIncomingMessage,
  updateFetchStatus,
} from '@redux/chats/chats.actions'
import { type useAppDispatch } from '@redux/hooks'
import { getTokenAmount } from '@utils/token.utils'
import { v4 as uuid } from 'uuid'

// Converts incoming text to a message object
export const incomingTextToMessage = (
  text: string,
  isDone = false,
): Message => {
  return {
    id: isDone ? uuid() : '-1',
    role: Role.ASSISTANT,
    content: text,
    tokens: getTokenAmount(text),
    ignored: false,
  }
}

// Decodes a streaming response from the OpenAI API
export const decodeStreamResponse = (response?: Uint8Array) => {
  const utf8Decoder = new TextDecoder('utf-8')

  if (response === null) {
    return ''
  }

  const pattern = /"delta":\s*({.*?"content":\s*".*?"})/g
  const decodedText = utf8Decoder.decode(response)
  const matches: string[] = []

  let match
  while ((match = pattern.exec(decodedText)) !== null) {
    matches.push(JSON.parse(match[1]).content)
  }
  return matches.join('')
}

// Prepares messages to be sent to the OpenAI API
export const prepareMessagesForAPI = (
  messages: Message[],
): Array<{ role: string; content: string }> => {
  return messages
    .filter(m => !m.ignored)
    .map(message => {
      const { id, tokens, ignored, ...rest } = message
      return rest
    })
}

// Handles the received text from the API
export const handleTextReceived = (
  text: string,
  currentChatId: string,
  dispatch: ReturnType<typeof useAppDispatch>,
  isDone = false,
) => {
  const message = incomingTextToMessage(text, isDone)
  dispatch(updateChatIncomingMessage(currentChatId, isDone ? null : message))
  if (isDone) {
    dispatch(updateFetchStatus(FetchStatus.IDLE))
    dispatch(addMessage(currentChatId, message))
  }
}

// Reads the stream response and handles the text accordingly
export async function readStreamResponse(
  reader: ReadableStreamDefaultReader,
  fullText: string,
  currentChatId: string,
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  const { value, done } = await reader.read()

  const newText = done ? fullText.trim() : decodeStreamResponse(value)
  const isDone = done || newText !== ''

  if (isDone) {
    fullText = done ? newText : fullText + newText
    handleTextReceived(fullText, currentChatId, dispatch, done)
  }

  if (!done) {
    await readStreamResponse(reader, fullText, currentChatId, dispatch)
  }
}
