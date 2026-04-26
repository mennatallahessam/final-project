import express from 'express'
import * as model from '../models/users'
import { protect } from '../middleware/auth'

const app = express.Router()

// GET /api/v1/users
app.get('/', (req, res) => {
  const users = model.getAll().map(u => model.enrichUser(u))
  res.json({ status: 'success', data: users })
})

// GET /api/v1/users/me — for auth store init
app.get('/me', (req: any, res) => {
  if (!req.user) return res.status(401).json({ status: 'fail', message: 'Not authenticated' })
  res.json({ status: 'success', data: req.user })
})

// GET /api/v1/users/:id
app.get('/:id', (req, res) => {
  const user = model.getById(req.params.id)
  if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
  const safeUser = model.enrichUser(user)
  res.json({ status: 'success', data: safeUser })
})

// POST /api/v1/users
app.post('/', (req, res) => {
  try {
    const user = model.create(req.body)
    const safeUser = model.enrichUser(user)
    res.status(201).json({ status: 'success', data: safeUser })
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
})

// PATCH /api/v1/users/:id
app.patch('/:id', (req, res) => {
  const user = model.update(req.params.id, req.body)
  if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
  const safeUser = model.enrichUser(user)
  res.json({ status: 'success', data: safeUser })
})

// DELETE /api/v1/users/:id
app.delete('/:id', (req, res) => {
  const deleted = model.remove(req.params.id)
  if (!deleted) return res.status(404).json({ status: 'fail', message: 'User not found' })
  res.status(204).send()
})

// POST /api/v1/users/friends
app.post('/friends', protect, (req: any, res) => {
  try {
    const { friendId } = req.body
    const user = model.getById(req.user.id)
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
    
    const friends = user.friends || []
    if (!friends.includes(friendId)) {
      friends.push(friendId)
      model.update(user.id, { friends })
    }
    
    res.json({ status: 'success', data: model.enrichUser(model.getById(user.id)!) })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// DELETE /api/v1/users/friends/:friendId
app.delete('/friends/:friendId', protect, (req: any, res) => {
  try {
    const { friendId } = req.params
    const user = model.getById(req.user.id)
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
    
    const friends = (user.friends || []).filter((id: string) => id !== friendId)
    model.update(user.id, { friends })
    
    res.json({ status: 'success', data: model.enrichUser(model.getById(user.id)!) })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default app
