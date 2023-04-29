import uiSlice, { type UiState, initialState } from '../ui.slice'

describe('uiSlice.reducer', () => {
  describe('toggleSidebar', () => {
    it('should toggle sidebarOpen value', () => {
      const testState: UiState = {
        ...initialState,
      }

      const newState = uiSlice(testState, {
        type: 'ui/toggleSidebar',
      })

      expect(newState.sidebarOpen).toBe(!initialState.sidebarOpen)
    })
  })

  describe('setSidebarOpen', () => {
    it('should set sidebarOpen to the given value', () => {
      const value = false

      const testState: UiState = {
        ...initialState,
      }

      const newState = uiSlice(testState, {
        type: 'ui/setSidebarOpen',
        payload: value,
      })

      expect(newState.sidebarOpen).toBe(value)
    })
  })

  describe('setApiKey', () => {
    it('should set apiKey to the given value', () => {
      const apiKey = 'test-api-key'

      const testState: UiState = {
        ...initialState,
      }

      const newState = uiSlice(testState, {
        type: 'ui/setApiKey',
        payload: apiKey,
      })

      expect(newState.apiKey).toBe(apiKey)
    })
  })
})
