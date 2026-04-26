import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import authController from './controllers/auth'
import usersController from './controllers/users'
import activitiesController from './controllers/activities'
import exerciseTypesController from './controllers/exerciseTypes'
import { protect } from './middleware/auth'

const app = express()
const PORT = process.env.PORT || 3000

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authController)
app.use('/api/v1/users', protect, usersController)
app.use('/api/v1/activities', protect, activitiesController)
app.use('/api/v1/exercise-types', exerciseTypesController)  // public

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'FitTrack API is running 🏃' })
})

// ── Global error handler ────────────────────────────────────────────────────
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Something went wrong' })
})

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ FitTrack server running at http://localhost:${PORT}`)
})
