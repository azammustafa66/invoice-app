import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'

import authRouter from './routes/auth.routes'
import invoiceRouter from './routes/invoice.routes'

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/invoices', invoiceRouter)

export default app
