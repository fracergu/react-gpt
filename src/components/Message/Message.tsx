import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { irBlack } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

import { Role, Message as MessageModel } from '@models/chat.model'

import personIcon from '@assets/person.svg'
import robotIcon from '@assets/robot.svg'
import copyIcon from '@assets/copy.svg'
import copyGreenIcon from '@assets/copy-green.svg'
import CodeBlock from '@components/CodeBlock/CodeBlock'

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
      className="w-full even:bg-zinc-800 odd:bg-zinc-900"
    >
      <div className="flex px-4 py-6 max-w-[90ch] my-0 mx-auto">
        <img
          className="w-6 h-6 mr-6 mt-1"
          src={message.role === Role.USER ? personIcon : robotIcon}
          alt="user"
        />
        <div className="w-[calc(100%-50px)]">
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
