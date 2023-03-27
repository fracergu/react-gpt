import personIcon from '@assets/icons/person.svg'
import robotIcon from '@assets/icons/robot.svg'
import CodeBlock from '@components/CodeBlock/CodeBlock'
import { type Message as MessageModel, Role } from '@models/chat.model'
import ReactMarkdown from 'react-markdown'

export enum MessageTestIds {
  Container = 'message-container',
}

export interface MessageProps {
  message: MessageModel
}

const Message = ({ message }: MessageProps) => {
  return (
    <div
      data-testid={MessageTestIds.Container}
      className="relative w-full even:bg-slate-800 odd:bg-slate-900"
    >
      <div
        className={`flex px-4 py-6 w-full md:max-w-[90ch] my-0 mx-auto relative ${
          message.ignored ? 'opacity-50' : ''
        }`}
      >
        <div>
          <img
            className="w-6 h-6 md:mr-6 md:mt-1 top-[15px] md:top-0 absolute md:relative"
            src={message.role === Role.USER ? personIcon : robotIcon}
            alt={message.role === Role.USER ? 'user' : 'assistant'}
          />
        </div>
        <div className="w-full pt-5 md:pt-0 md:w-[calc(100%-50px)]">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className ?? '')
                return (
                  <CodeBlock match={match} inline={inline}>
                    {children}
                  </CodeBlock>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default Message
