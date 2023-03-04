export enum SidenavTestIds {
  Container = 'sidenav-container',
}

const Sidenav = () => {
  return <div data-testid={SidenavTestIds.Container}>Sidenav</div>
}

export default Sidenav
