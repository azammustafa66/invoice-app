import { Request, Response, NextFunction } from 'express'

const verifyCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'POST') {
      const csrfTokenCookie = req.cookies?.csrfToken
      const csrfTokenHeader = req.headers?.['x-csrf-token'] as string

      if (!(csrfTokenCookie || csrfTokenHeader)) {
        console.error('CSRF token mismatch or missing')
        return res.status(403).json({ error: 'Invalid or missing CSRF token' })
      }
    }
    next()
  } catch (error) {
    console.error('Error in CSRF token verification:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default verifyCsrfToken
