import express from 'express'
import * as model from '../models/activities'
import { getById as getExerciseTypeById } from '../models/exerciseTypes'

const app = express.Router()

// GET /api/v1/activities — all activities (admin)
app.get('/', (req: any, res) => {
  const activities = model.getAll().map(model.enrich)
  res.json({ status: 'success', data: activities })
})

// GET /api/v1/activities/me — current user's activities
app.get('/me', (req: any, res) => {
  const activities = model.getByUserId(req.user.id).map(model.enrich)
  res.json({ status: 'success', data: activities })
})

// GET /api/v1/activities/user/:userId
app.get('/user/:userId', (req, res) => {
  const activities = model.getByUserId(req.params.userId).map(model.enrich)
  res.json({ status: 'success', data: activities })
})

// GET /api/v1/activities/:id
app.get('/:id', (req, res) => {
  const activity = model.getById(req.params.id)
  if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })
  res.json({ status: 'success', data: model.enrich(activity) })
})

// POST /api/v1/activities
app.post('/', (req: any, res) => {
  try {
    const { exercise_type_id, duration, distance, date, notes } = req.body
    if (!exercise_type_id || !duration || !date) {
      return res.status(400).json({ status: 'fail', message: 'exercise_type_id, duration and date are required' })
    }
    // Auto-calculate calories based on exercise type
    const exerciseType = getExerciseTypeById(exercise_type_id)
    const calories = exerciseType ? Math.round(exerciseType.default_calories_per_minute * duration) : 0

    const activity = model.create({
      user_id: req.user.id,
      exercise_type_id,
      duration: Number(duration),
      distance: distance ? Number(distance) : undefined,
      date,
      calories,
      notes
    })
    res.status(201).json({ status: 'success', data: model.enrich(activity) })
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
})

// PATCH /api/v1/activities/:id
app.patch('/:id', (req: any, res) => {
  const activity = model.update(req.params.id, req.body)
  if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })
  res.json({ status: 'success', data: model.enrich(activity) })
})

// DELETE /api/v1/activities/:id
app.delete('/:id', (req, res) => {
  const deleted = model.remove(req.params.id)
  if (!deleted) return res.status(404).json({ status: 'fail', message: 'Activity not found' })
  res.status(204).send()
})

export default app
