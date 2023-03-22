import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Role, Message as MessageModel } from '@models/chat.model'

import personIcon from '@assets/person.svg'
import robotIcon from '@assets/robot.svg'
import CodeBlock from '@components/CodeBlock/CodeBlock'
import { useAppSelector } from '@redux/hooks'
import { selectIsMobile } from '@redux/ui/uiSlice'

export enum MessageTestIds {
  Container = 'message-container',
}

export type MessageProps = {
  message: MessageModel
  idx: number
}

const Message = ({ message, idx }: MessageProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2500)
    }
  }, [copied])

  return (
    <div
      data-testid={MessageTestIds.Container}
      key={idx}
      className="relative w-full even:bg-zinc-800 odd:bg-zinc-900 "
    >
      <div className="flex px-4 py-6 w-full md:max-w-[90ch] my-0 mx-auto relative">
        <img
          className="w-20 h-20 md:w-6 md:h-6 opacity-5 md:opacity-100 md:mr-6 md:mt-1 top-[20px] md:top-0 absolute md:relative "
          src={message.role === Role.USER ? personIcon : robotIcon}
          alt="user"
        />
        <div className="w-full pt-5 md:pt-0 md:w-[calc(100%-50px)]">
          <ReactMarkdown
            children={message.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return (
                  <CodeBlock match={match} content={children} inline={inline} />
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
