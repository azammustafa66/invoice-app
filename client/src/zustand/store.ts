import { create } from 'zustand'
import { Cookies } from 'react-cookie'
import { Invoice } from '../utils/types'

const cookies = new Cookies()

interface User {
  _id: string
  email: string
  name: string
  refreshToken: string
}

type Store = {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  isFormOpen: boolean
  setFormOpen: (isOpen: boolean) => void
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void
  isNewInvoice: boolean
  setIsNewInvoice: (isNewInvoice: boolean) => void
  invoices: Invoice[]
  setInvoices: (invoices: Invoice[]) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (invoiceId: string, updatedInvoice: Invoice) => void
  deleteInvoice: (invoiceId: string) => void
}

export const useStore = create<Store>((set) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  isFormOpen: false,
  setFormOpen: (isFormOpen) => set({ isFormOpen }),

  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => {
    set({ user, isAuthenticated: !!user }) // Update isAuthenticated when setting user
    localStorage.setItem('user', JSON.stringify(user))
  },
  isAuthenticated: !!localStorage.getItem('user'),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => {
    set({ user: null, isAuthenticated: false, invoices: [] })
    cookies.remove('accessToken')
    cookies.remove('refreshToken')
    cookies.remove('csrfToken')
    localStorage.removeItem('user')
    localStorage.removeItem('invoices')
  },

  // Invoice Management
  invoices: JSON.parse(localStorage.getItem('invoices') || '[]'),
  setInvoices: (invoices) => {
    set({ invoices })
    localStorage.setItem('invoices', JSON.stringify(invoices))
  },
  addInvoice: (invoice: Invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
  updateInvoice: (invoiceId, updatedInvoice) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv._id === invoiceId ? updatedInvoice : inv))
    }))
  },
  deleteInvoice: (invoiceId) => {
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv._id !== invoiceId)
    }))
  },
  isNewInvoice: false,
  setIsNewInvoice: (isNewInvoice) => set({ isNewInvoice })
}))
