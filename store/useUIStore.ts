import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  drawerOpen: boolean
  drawerContent: React.ReactNode | null
  theme: Theme
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  openDrawer: (content: React.ReactNode) => void
  closeDrawer: () => void
  setTheme: (theme: Theme) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileSidebarOpen: false,
      drawerOpen: false,
      drawerContent: null,
      theme: 'light',
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),

      toggleMobileSidebar: () => set((state) => ({
        mobileSidebarOpen: !state.mobileSidebarOpen
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      
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
