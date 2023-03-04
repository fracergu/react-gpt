export const enum AppTestIds {
  Container = 'app-container',
}

function App() {
  return (
    <div
      data-testid={AppTestIds.Container}
      className="w-screen h-screen flex justify-center items-center bg-slate-900"
    >
      <h1 className="text-xl font-bold h-fit text-green-400 transition ease-in-out hover:drop-shadow-[0_0_5px_rgba(74,222,128,1)] ">
        Vite + React + Typescript + Eslint + Vitest + Tailwind + Husky
      </h1>
    </div>
  )
}

export default App
