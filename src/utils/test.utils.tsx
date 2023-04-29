import type { PreloadedState } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import React, { type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { setupStore } from '../redux/store'
import type { AppStore, RootState } from '../redux/store'
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
