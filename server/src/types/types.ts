import { Request } from 'express'
import { Document, Types } from 'mongoose'

export interface DecodedRefreshToken {
  _id: string
}

export interface CustomRequest extends Request {
  user?: IUser
  csrfToken?: string
}

export interface IUser extends Document {
  _id?: string
  email: string
  password: string
  refreshToken?: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  comparePassword(password: string): Promise<boolean>
  generateAccessToken: () => string
  generateRefreshToken: () => string
}

export interface IAddress extends Document {
  _id?: string
  street: string
  city: string
  state?: string
  postCode: string
  country: string
}

export interface IClient extends Document {
  _id?: string
  name: string
  email: string
}

export interface IInvoiceItem extends Document {
  _id?: string
  name: string
  description?: string
  quantity: number
  price: number
  total: number
}

export interface IInvoice extends Document {
  _id?: string
  createdBy: IUser | Types.ObjectId
  client: Types.ObjectId | IClient
  invoiceItems: IInvoiceItem[]
  invoiceNumber: number
  invoiceDate: Date
  clientAddress: Types.ObjectId | IAddress
  senderAddress: Types.ObjectId | IAddress
  description: string
  paymentDue: Date
  status: 'paid' | 'pending' | 'draft'
  totalAmount: Number
}
