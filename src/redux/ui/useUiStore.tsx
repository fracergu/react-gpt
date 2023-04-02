import { create } from 'zustand'

interface UiStore {
  isSidebarOpen: boolean
  autoPromptCleanup: boolean
  apiKey: string | null
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  setApiKey: (apiKey: string) => void
  toggleAutoPromptCleanup: () => void
}

export const useUiStore = create<UiStore>(set => ({
  isSidebarOpen: true,
  autoPromptCleanup: true,
  apiKey: null,
  toggleSidebar: () => {
    set(state => ({
      isSidebarOpen: !state.isSidebarOpen,
    }))
  },
  setSidebarOpen: (isOpen: boolean) => {
    set({ isSidebarOpen: isOpen })
  },

  setApiKey: (apiKey: string) => {
    set({ apiKey })
  },
  toggleAutoPromptCleanup: () => {
    set(state => ({
      autoPromptCleanup: !state.autoPromptCleanup,
    }))
  },
}))

useUiStore.subscribe(({ autoPromptCleanup, apiKey }) => {
  const state = { autoPromptCleanup, apiKey }
  localStorage.setItem('ui', JSON.stringify(state))
})
