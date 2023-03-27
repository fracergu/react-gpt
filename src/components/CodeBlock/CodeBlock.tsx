import copyIcon from '@assets/icons/copy.svg'
import { type ReactNode, useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { irBlack } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export interface CodeBlockProps {
  inline?: boolean
  match: RegExpExecArray | null
  children: ReactNode
}

export enum CodeBlockTestIds {
  Container = 'code-block-container',
}

const CodeBlock = ({ inline = false, match, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2500)
    }
  }, [copied])

  return !inline ? (
    <div className="my-4 shadow-md" data-testid={CodeBlockTestIds.Container}>
      <div className="flex items-center text-gray-400 bg-zinc-900 py-2 px-4 justify-between rounded-t-md items-center">
        <span className="font-bold text-xs ">
          {match !== null ? match[1] : ''}
        </span>
        <CopyToClipboard
          text={String(children).replace(/\n$/, '')}
          onCopy={() => {
            setCopied(true)
          }}
        >
          <div className="flex items-center justify-center">
            <div className="text-xs text-gray-400 mr-2">
              {copied ? 'Copied!' : ''}
            </div>
            <button className="text-gray-400">
              <img src={copyIcon} alt="copy" className="w-4 h-4" />
            </button>
          </div>
        </CopyToClipboard>
      </div>
      <div className="overflow-x-auto rounded-b-md">
        <SyntaxHighlighter
          style={irBlack}
          className="!whitespace-pre !px-4 !py-2"
          language={match !== null ? match[1] : ''}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  ) : (
    <code className="bg-zinc-900 text-gray-400 py-1 px-2 rounded-md mb-1">
      {children}
    </code>
  )
}

export default CodeBlock
