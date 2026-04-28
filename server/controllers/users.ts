import express from 'express'
import * as model from '../models/users'
import { protect, restrictTo } from '../middleware/auth'

const app = express.Router()

// GET /api/v1/users
app.get('/', async (req, res) => {
  try {
    const users = await model.getAll()
    const enrichedUsers = await Promise.all(users.map(u => model.enrichUser(u)))
    res.json({ status: 'success', data: enrichedUsers })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/users/me — for auth store init
app.get('/me', (req: any, res) => {
  if (!req.user) return res.status(401).json({ status: 'fail', message: 'Not authenticated' })
  res.json({ status: 'success', data: req.user })
})

// GET /api/v1/users/:id
app.get('/:id', async (req, res) => {
  try {
    const user = await model.getById(req.params.id)
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
    const safeUser = await model.enrichUser(user)
    res.json({ status: 'success', data: safeUser })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// POST /api/v1/users (Admin only)
app.post('/', restrictTo('admin'), async (req, res) => {
  try {
    const bcrypt = await import('bcryptjs');
    const { password, ...rest } = req.body;
    let newUserData = req.body;
    
    if (password) {
      const hashedPassword = await bcrypt.default.hash(password, 10);
      newUserData = { ...rest, password: hashedPassword };
    }
    
    const user = await model.create(newUserData);
    const safeUser = await model.enrichUser(user);
    res.status(201).json({ status: 'success', data: safeUser });
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
})

// PATCH /api/v1/users/:id (Admin only)
app.patch('/:id', restrictTo('admin'), async (req, res) => {
  try {
    const bcrypt = await import('bcryptjs');
    const { password, ...rest } = req.body;
    let updates = req.body;
    
    if (password) {
      const hashedPassword = await bcrypt.default.hash(password, 10);
      updates = { ...rest, password: hashedPassword };
    }

    const user = await model.update(req.params.id, updates);
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    const safeUser = await model.enrichUser(user);
    res.json({ status: 'success', data: safeUser });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
})

// DELETE /api/v1/users/:id (Admin only)
app.delete('/:id', restrictTo('admin'), async (req, res) => {
  try {
    const deleted = await model.remove(req.params.id)
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'User not found' })
    res.status(204).send()
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// POST /api/v1/users/friends
app.post('/friends', protect, async (req: any, res) => {
  try {
    const { friendId } = req.body
    const user = await model.getById(req.user.id)
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
    
    const friends = user.friends || []
    if (!friends.includes(friendId)) {
      friends.push(friendId)
      await model.update(user.id, { friends })
    }
    
    const updatedUser = await model.getById(user.id)
    const safeUser = await model.enrichUser(updatedUser!)
    res.json({ status: 'success', data: safeUser })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// DELETE /api/v1/users/friends/:friendId
app.delete('/friends/:friendId', protect, async (req: any, res) => {
  try {
    const { friendId } = req.params
    const user = await model.getById(req.user.id)
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' })
    
    const friends = (user.friends || []).filter((id: string) => id !== friendId)
    await model.update(user.id, { friends })
    
    const updatedUser = await model.getById(user.id)
    const safeUser = await model.enrichUser(updatedUser!)
    res.json({ status: 'success', data: safeUser })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default app
