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
