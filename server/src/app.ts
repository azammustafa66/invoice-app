import express, { Request, Response } from 'express'

import router from './routes/routes'
import cookieParser from 'cookie-parser'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api/v1', router)

export default app
