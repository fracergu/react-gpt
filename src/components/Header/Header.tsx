import robotIcon from '@assets/robot.svg'
import githubIcon from '@assets/github.svg'

export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  return (
    <nav
      data-testid={HeaderTestIds.Container}
      className="p-6 flex items-center justify-between font-open-sans"
    >
      <div className="flex">
        <img src={robotIcon} alt="robot" className="w-8 h-8 mr-4" />
        <h1 className="text-2xl">React GPT</h1>
      </div>
      <a
        href="https://github.com/fracergu/react-gpt-client"
        rel="noreferrer"
        target="_blank"
      >
        <img src={githubIcon} alt="github" className="w-8 h-8" />
      </a>
    </nav>
  )
}

export default Header
