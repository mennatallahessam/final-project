import express from 'express'
import * as model from '../models/activities'
import { getById as getExerciseTypeById } from '../models/exerciseTypes'
import { restrictTo } from '../middleware/auth'

const app = express.Router()

// GET /api/v1/activities — all activities (admin)
app.get('/', restrictTo('admin'), async (req: any, res) => {
  try {
    const activities = await model.getAll()
    const enrichedActivities = await Promise.all(activities.map(model.enrich))
    res.json({ status: 'success', data: enrichedActivities })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/activities/me — current user's activities
app.get('/me', async (req: any, res) => {
  try {
    const activities = await model.getByUserId(req.user.id)
    const enrichedActivities = await Promise.all(activities.map(model.enrich))
    res.json({ status: 'success', data: enrichedActivities })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/activities/user/:userId
app.get('/user/:userId', async (req, res) => {
  try {
    const activities = await model.getByUserId(req.params.userId)
    const enrichedActivities = await Promise.all(activities.map(model.enrich))
    res.json({ status: 'success', data: enrichedActivities })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/activities/:id
app.get('/:id', async (req, res) => {
  try {
    const activity = await model.getById(req.params.id)
    if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })
    const enriched = await model.enrich(activity)
    res.json({ status: 'success', data: enriched })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// POST /api/v1/activities
app.post('/', async (req: any, res) => {
  try {
    const { exercise_type_id, duration, distance, date, notes } = req.body
    if (!exercise_type_id || !duration || !date) {
      return res.status(400).json({ status: 'fail', message: 'exercise_type_id, duration and date are required' })
    }
    // Auto-calculate calories based on exercise type
    const exerciseType = await getExerciseTypeById(exercise_type_id)
    const calories = exerciseType ? Math.round(exerciseType.defaultCaloriesPerMinute * duration) : 0

    const activity = await model.create({
      user_id: req.user.id,
      exercise_type_id,
      duration: Number(duration),
      distance: distance ? Number(distance) : undefined,
      date,
      calories,
      notes
    })
    const enriched = await model.enrich(activity)
    res.status(201).json({ status: 'success', data: enriched })
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
})

// PATCH /api/v1/activities/:id
app.patch('/:id', async (req: any, res) => {
  try {
    const activity = await model.update(req.params.id, req.body)
    if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })
    const enriched = await model.enrich(activity)
    res.json({ status: 'success', data: enriched })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// DELETE /api/v1/activities/:id
app.delete('/:id', async (req, res) => {
  try {
    const deleted = await model.remove(req.params.id)
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'Activity not found' })
    res.status(204).send()
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default app
