import { create } from 'zustand'

type Store = {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  isFormOpen: boolean
  setFormOpen: (isOpen: boolean) => void
}

export const useStore = create<Store>((set) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  isFormOpen: false,
  setFormOpen: (isFormOpen) => set({ isFormOpen })
}))
