export type LoginFormData = {
  email: string
  password: string
}

export type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type CookieOptions = {
  path: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict'
}

interface Client {
  _id: string
  email: string
  name: string
  __v?: number // Optional since it's not always present
}

interface Address {
  _id: string
  street: string
  city: string
  postCode: string
  country: string
  __v?: number // Optional
}

interface InvoiceItem {
  _id: string
  name: string
  quantity: number
  price: number
  total: number
  __v?: number // Optional
}

export interface Invoice {
  _id: string
  createdBy: string
  paymentDue: string // Date string in ISO format
  client: Client
  status: 'pending' | 'paid' | 'draft' // Assuming these are the possible statuses
  clientAddress: Address
  senderAddress: Address
  invoiceItems: InvoiceItem[]
  totalAmount: number
  createdAt: string // Date string in ISO format
  updatedAt: string // Date string in ISO format
  __v?: number // Optional
}
