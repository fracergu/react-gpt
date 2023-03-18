export enum HeaderTestIds {
  Container = 'header-container',
}

const Header = () => {
  return (
    <nav
      data-testid={HeaderTestIds.Container}
      className="p-4 flex justify-center font-open-sans"
    >
      <h1 className="text-2xl ">React-GPT-Client</h1>
    </nav>
  )
}

export default Header
