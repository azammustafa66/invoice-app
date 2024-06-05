import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import 'dotenv/config'

import { CustomRequest, DecodedRefreshToken, IUser } from '../types/types'
import User from '../models/user.model'

const generateTokens = async (user: IUser) => {
  try {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    const csrfToken = crypto.randomBytes(64).toString('hex')

    if (!accessToken || !refreshToken || !csrfToken) {
      throw new Error('Failed to generate tokens')
    }

    await User.updateOne({ _id: user._id }, { $set: { refreshToken } })
    return { accessToken, refreshToken, csrfToken }
  } catch (error) {
    throw new Error('Failed to generate tokens')
  }
}

const sendResponse = (
  req: Request,
  res: Response,
  user: IUser,
  accessToken: string,
  refreshToken: string,
  csrfToken: string,
) => {
  res.status(200).json({
    user,
    accessToken,
    refreshToken,
    csrfToken
  })
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name, confirmPassword } = req.body

  if ([email, password, name].some((field) => field?.trim() === '')) {
    return res.status(400).json({ message: 'Please fill in all fields' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' })
  }

  const doesUserExist = await User.findOne({ email })

  if (doesUserExist) {
    return res.status(400).json({ message: 'User already exists' })
  }

  try {
    const newUser = new User({ email, password, name })
    await newUser.save()
    const user = await User.findOne({ email }).select('-password -refreshToken -__v')

    if (!user) {
      throw new Error('Failed to create user')
    }

    const { accessToken, refreshToken, csrfToken } = await generateTokens(user)
    sendResponse(req, res, user, accessToken, refreshToken, csrfToken)
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if ([email, password].some((field) => field?.trim() === '')) {
    return res.status(400).json({ message: 'Please fill in all fields' })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: 'User does not exist' })
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const userWithoutSensitiveInfo = await User.findOne({ email }).select(
    '-refreshToken -password -__v'
  )

  const { accessToken, refreshToken, csrfToken } = await generateTokens(user)

  sendResponse(req, res, userWithoutSensitiveInfo!, accessToken, refreshToken, csrfToken)
}

export async function refreshAccessToken(req: Request, res: Response) {
  const incomingRefreshToken =
    req.cookies?.refreshToken ?? req.headers?.authorization?.split(' ')[1]

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as DecodedRefreshToken

  const user = await User.findOne({ _id: decoded._id })

  if (!user || user.refreshToken !== incomingRefreshToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userWithoutSensitiveInfo = await User.findOne({ _id: decoded._id }).select(
    '-refreshToken -password -__v'
  )

  const { accessToken, refreshToken: newRefreshToken, csrfToken } = await generateTokens(user)

  sendResponse(req, res, userWithoutSensitiveInfo!, accessToken, newRefreshToken, csrfToken)
}

export const logout = async (req: CustomRequest, res: Response) => {
  res
    .status(200)
    .clearCookie('refreshToken', {
      sameSite: 'none',
      secure: false,
      httpOnly: false
    })
    .clearCookie('accessToken', {
      sameSite: 'none',
      secure: false,
      httpOnly: false
    })
    .clearCookie('csrfToken', {
      sameSite: 'none',
      secure: false,
      httpOnly: false
    })
    .clearCookie('user', {
      sameSite: 'none',
      secure: false,
      httpOnly: false
    })

  await User.findOneAndUpdate({ _id: req.user?._id }, { $set: { refreshToken: '' } })

  return res.json({ message: 'Logged out successfully' })
}
