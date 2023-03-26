import { useState } from 'react'

export interface ApiKeyPromptProps {
  updateApiKey: (apiKey: string) => void
}

export enum ApiKeyPromptTestIds {
  Container = 'api-key-prompt-container',
}

const ApiKeyPrompt = ({ updateApiKey }: ApiKeyPromptProps) => {
  const [apiKey, setApiKey] = useState('')
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const [inputTouched, setInputTouched] = useState(false)

  const handleSetApiKeyButtonClick = () => {
    if (isApiKeyValid) {
      updateApiKey(apiKey)
      window.location.reload()
    }
  }

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value
    setInputTouched(true)
    setApiKey(key)
    setIsApiKeyValid(checkApiKeyValidity(key))
  }

  const checkApiKeyValidity = (key: string) => {
    const validLength = key.length === 51
    const validPrefix = key.startsWith('sk-')
    return validLength && validPrefix
  }

  const isSetButtonEnabled = isApiKeyValid && inputTouched

  return (
    <div
      data-testid={ApiKeyPromptTestIds.Container}
      className="flex flex-col w-full h-full items-center justify-center p-3"
    >
      <div className="flex flex-col gap-3 max-w-[90ch]">
        <h1 className="text-2xl">No API key found</h1>
        <p>
          It appears that the application does not have an API key configured in
          the environment and a local variable has not been found. Please enter
          an API key to set it locally. You can get it{' '}
          <a
            className="underline"
            href="https://beta.openai.com/account/api-keys"
            rel="noreferrer"
            target="_blank"
          >
            here.
          </a>
        </p>
        <div className="flex gap-3">
          <input
            className="w-fit focus:outline-none p-2 bg-zinc-700 text-gray-100 rounded-md grow"
            type="text"
            placeholder="API key"
            value={apiKey}
            onChange={handleApiKeyInputChange}
          />
          <button
            className="bg-blue-800 text-white rounded-md p-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSetApiKeyButtonClick}
            disabled={!isSetButtonEnabled}
          >
            Set API key
          </button>
        </div>
        {!isApiKeyValid && inputTouched && (
          <p className="text-red-500">
            Invalid API key: Must have 51 characters and &#39;sk-&#39; prefix
          </p>
        )}
      </div>
    </div>
  )
}
export default ApiKeyPrompt
