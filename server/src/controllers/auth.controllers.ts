import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import { IUser } from '../types/types'
import User from '../models/user.model'

const isDesktop = (req: Request) =>
  req.headers['user-agent']?.includes('PostmanRuntime') ||
  req.headers['user-agent']?.includes('Windows') ||
  req.headers['user-agent']?.includes('Macintosh') ||
  req.headers['sec-ch-ua-platform'] === 'Windows' ||
  req.headers['sec-ch-ua-platform'] === 'macOS'

const generateTokens = async (user: IUser) => {
  try {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    if (!accessToken || !refreshToken) {
      throw new Error('Failed to generate tokens')
    }

    await User.updateOne({ _id: user._id }, { $set: { refreshToken } })
    return { accessToken, refreshToken }
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
  register = true
) => {
  if (isDesktop(req)) {
    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production'
      })
      .cookie('accessToken', accessToken, {
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production'
      })
      .cookie('user', JSON.stringify(user), {
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production'
      })
      .json({ message: `User ${register ? 'registred' : 'logged in'} successfully` })
  } else {
    res.status(200).json({
      user,
      accessToken,
      refreshToken
    })
  }
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

    const { accessToken, refreshToken } = await generateTokens(user)
    sendResponse(req, res, user, accessToken, refreshToken)
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
    return res.status(404).json({ message: 'User not found' })
  }

  if (!user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  const userWithoutSensitiveInfo = await User.findOne({ email }).select(
    '-refreshToken -password -__v'
  )

  const { accessToken, refreshToken } = await generateTokens(user)

  sendResponse(req, res, userWithoutSensitiveInfo!, accessToken, refreshToken, false)
}
