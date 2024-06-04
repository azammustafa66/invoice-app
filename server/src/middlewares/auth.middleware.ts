import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { CustomRequest, IUser } from '../types/types'
import User from '../models/user.model'

const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') ?? req.cookies?.accessToken

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as IUser
    const user = await User.findById(decoded?._id).select('-password -refreshToken -__v')

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default verifyToken
