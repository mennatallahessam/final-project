import express from 'express'
import * as model from '../models/exerciseTypes'

const app = express.Router()

// GET /api/v1/exercise-types
app.get('/', (req, res) => {
  res.json({ status: 'success', data: model.getAll() })
})

// GET /api/v1/exercise-types/:id
app.get('/:id', (req, res) => {
  const type = model.getById(req.params.id)
  if (!type) return res.status(404).json({ status: 'fail', message: 'Exercise type not found' })
  res.json({ status: 'success', data: type })
})

export default app
