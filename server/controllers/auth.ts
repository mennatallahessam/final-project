import express from 'express'
import bcrypt from 'bcryptjs'
import { getByUsername, getByEmail, create, getById, enrichUser } from '../models/users'
import { signToken, protect } from '../middleware/auth'

const app = express.Router()

// POST /api/v1/auth/register
app.post('/register', async (req, res) => {
  try {
    const { username, email, fullName, password, role } = req.body

    if (!username || !email || !fullName || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide username, email, fullName and password' })
    }

    if (getByUsername(username)) {
      return res.status(400).json({ status: 'fail', message: 'Username already taken' })
    }

    if (getByEmail(email)) {
      return res.status(400).json({ status: 'fail', message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`

    const newUser = create({
      username,
      email,
      full_name: fullName,
      password: hashedPassword,
      role: role || 'user',
      avatar
    })

    const token = signToken(newUser.id)
    const safeUser = enrichUser(newUser)

    res.status(201).json({
      status: 'success',
      token,
      data: { user: safeUser }
    })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// POST /api/v1/auth/login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide username and password' })
    }

    const user = getByUsername(username)
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' })
    }

    const token = signToken(user.id)
    const safeUser = enrichUser(user)

    res.json({
      status: 'success',
      token,
      data: { user: safeUser }
    })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/auth/me — returns current user from token
app.get('/me', protect, (req: any, res) => {
  res.json({ status: 'success', data: req.user })
})

export default app
