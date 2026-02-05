import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  sidebarOpen: boolean
  drawerOpen: boolean
  drawerContent: React.ReactNode | null
  theme: Theme
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openDrawer: (content: React.ReactNode) => void
  closeDrawer: () => void
  setTheme: (theme: Theme) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      drawerOpen: false,
      drawerContent: null,
      theme: 'light',
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      openDrawer: (content) => set({ 
        drawerOpen: true, 
        drawerContent: content 
      }),
      
      closeDrawer: () => set({ 
        drawerOpen: false, 
        drawerContent: null 
      }),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'worknest-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
)
