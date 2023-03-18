import { Role, Message as MessageModel } from '@models/chat.model'

import personIcon from '@assets/person.svg'
import robotIcon from '@assets/robot.svg'

import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import codeBlockTheme from 'react-syntax-highlighter/dist/cjs/styles/hljs/ir-black'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import copyIcon from '@assets/copy.svg'
import copyGreenIcon from '@assets/copy-green.svg'
import { useEffect, useState } from 'react'

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
      className="w-full even:bg-gray-700 odd:bg-gray-800"
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
                return !inline && match ? (
                  <div className="my-4">
                    <div className="flex items-center text-gray-400 bg-gray-900 py-2 px-4 justify-between ">
                      <span className="font-bold text-xs ">
                        {match[1] ? match[1] : ''}
                      </span>
                      <CopyToClipboard
                        text={String(children).replace(/\n$/, '')}
                        onCopy={() => setCopied(true)}
                      >
                        <div className="flex items-center">
                          <span className="text-s text-green-400">
                            {copied ? 'Copied!' : ''}
                          </span>
                          <button className="bg-gray-900 text-gray-400 p-2 rounded-md mb-1">
                            <img
                              src={copied ? copyGreenIcon : copyIcon}
                              alt="copy"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </CopyToClipboard>
                    </div>
                    <div className="overflow-x-auto">
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, '')}
                        style={codeBlockTheme as any}
                        className="!whitespace-pre !px-4 !py-2"
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      />
                    </div>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
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
