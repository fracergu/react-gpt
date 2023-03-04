# React ChatGPT Client

A React client for the ChatGPT API.

## Features

- React
- TypeScript
- TailwindCSS
- Vite
- Vitest
- ESLint
- Prettier
- Husky
- Dotenv

## Usage

Just clone the repository and install the dependencies. Then, copy the `.env.example` file to `.env` and replace the values with your own.
To get your own API key, you can get it for free at [OpenAI](https://platform.openai.com/account/api-keys)

Finally, start the development server with `npm run dev` or build for production with `npm run build`.

## Contributing

- Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
- Please make sure to update tests as appropriate.
- Use [Git Branch Naming Conventions](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) for branch names. and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.
- Also, name the branch starting with the issue number, for example: `/feature/1-branch-name`.

## Changes in sight

- Implement react-redux for state management
- Save conversations to local storage and implement a side menu to continue previous conversations.
- Implement a simple but nice UI with TailwindCSS with dark mode
- Solve the 2048 API token limit for prompt. As the conversation grows, the API token limit is reached and the conversation stops. This is a limitation of the API. Two possible solutions are:
  - Remove older messages from the prompt (this will make ChatGPT forget that part of the conversation)
  - Ask ChatGPT on background to generate a summary of the conversation and use that as the context for the next message. This will make ChatGPT remember the whole conversation but lose details.
- Implement a system to control the amount of current tokens in the prompt.
