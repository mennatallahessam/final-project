import express from 'express'
import * as model from '../models/exerciseTypes'

const app = express.Router()

// GET /api/v1/exercise-types
app.get('/', async (req, res) => {
  try {
    const types = await model.getAll()
    res.json({ status: 'success', data: types })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/exercise-types/:id
app.get('/:id', async (req, res) => {
  try {
    const type = await model.getById(req.params.id)
    if (!type) return res.status(404).json({ status: 'fail', message: 'Exercise type not found' })
    res.json({ status: 'success', data: type })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default app
