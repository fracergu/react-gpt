import ReactMarkdown from 'react-markdown'

import { Role, Message as MessageModel } from '@models/chat.model'

import personIcon from '@assets/person.svg'
import robotIcon from '@assets/robot.svg'
import CodeBlock from '@components/CodeBlock/CodeBlock'

export enum MessageTestIds {
  Container = 'message-container',
}

export type MessageProps = {
  message: MessageModel
  idx: number
}

const Message = ({ message, idx }: MessageProps) => {
  return (
    <div
      data-testid={MessageTestIds.Container}
      className="relative w-full even:bg-zinc-800 odd:bg-zinc-900 "
    >
      <div className="flex px-4 py-6 w-full md:max-w-[90ch] my-0 mx-auto relative">
        <img
          className="w-6 h-6 md:mr-6 md:mt-1 top-[15px] md:top-0 absolute md:relative "
          src={message.role === Role.USER ? personIcon : robotIcon}
          alt={message.role === Role.USER ? 'user' : 'assistant'}
        />
        <div className="w-full pt-5 md:pt-0 md:w-[calc(100%-50px)]">
          <ReactMarkdown
            children={message.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return (
                  <CodeBlock match={match} inline={inline}>
                    {children}
                  </CodeBlock>
                )
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Message
