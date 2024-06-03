import { Request } from 'express'

export interface IUser {
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

export interface CustomRequest extends Request {
  user?: IUser
}
