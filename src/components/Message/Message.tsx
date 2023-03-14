import { Role, Message as MessageModel } from '@models/chat.model'
import { useAppSelector } from '@redux/hooks'
import { selectTheme } from '@redux/ui/uiSlice'

import personLight from '@assets/person-light.svg'
import personDark from '@assets/person-dark.svg'
import robotLight from '@assets/robot-light.svg'
import robotDark from '@assets/robot-dark.svg'

export enum MessageTestIds {
  Container = 'message-container',
}

export type MessageProps = {
  message: MessageModel
  idx: number
}

const Message = ({ message, idx }: MessageProps) => {
  const currentTheme = useAppSelector(selectTheme)

  return (
    <div
      data-testid={MessageTestIds.Container}
      key={idx}
      className="w-full even:bg-gray-100 dark:even:bg-gray-700 odd:bg-gray-200 dark:odd:bg-gray-800"
    >
      <div className="flex px-4 py-6 max-w-[90ch] my-0 mx-auto">
        <img
          className="w-6 h-6 mr-6 mt-1"
          src={
            message.role === Role.USER
              ? currentTheme === 'light'
                ? personLight
                : personDark
              : currentTheme === 'light'
              ? robotLight
              : robotDark
          }
          alt="user"
        />
        <div>{message.content}</div>
      </div>
    </div>
  )
}

export default Message
