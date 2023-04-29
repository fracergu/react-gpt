import { type Dispatch } from '@reduxjs/toolkit'
import { vi } from 'vitest'

import * as uiActions from '../ui.actions'

describe('uiActions', () => {
  it('should dispatch setSidebarOpen', () => {
    const dispatch: Dispatch = vi.fn()
    const isOpen = true

    uiActions.setSidebarOpen(isOpen)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ui/setSidebarOpen',
      payload: isOpen,
    })
  })

  it('should dispatch setApiKey', () => {
    const dispatch: Dispatch = vi.fn()
    const apiKey = 'test-api-key'

    uiActions.setApiKey(apiKey)(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ui/setApiKey',
      payload: apiKey,
    })
  })
})
