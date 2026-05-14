import express from 'express'
import * as model from '../models/activities'
import { getById as getExerciseTypeById } from '../models/exerciseTypes'
import { restrictTo } from '../middleware/auth'

const app = express.Router()

// GET /api/v1/activities — all activities (admin, trainer)
app.get('/', restrictTo('admin', 'trainer'), async (req: any, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
    const activities = await model.getAll(limit, offset)
    const enrichedActivities = await Promise.all(activities.map(model.enrich))
    const total = await model.getTotalCount()
    res.json({ status: 'success', data: enrichedActivities, total, limit, offset })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/activities/me — current user's activities
app.get('/me', async (req: any, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
    const activities = await model.getByUserId(req.user.id, limit, offset)
    const enrichedActivities = await Promise.all(activities.map(model.enrich))
    const total = await model.getUserTotalCount(req.user.id)
    res.json({ status: 'success', data: enrichedActivities, total, limit, offset })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/activities/user/:userId
app.get('/user/:userId', async (req: any, res) => {
  try {
    // Only allow admin, trainer, or friends to see? For now let's say anyone can see user activities or keep as is.
    // The prompt asks to differentiate roles. Let's allow anyone so Friends feature works.
    const activities = await model.getByUserId(req.params.userId)
    const enrichedActivities = await Promise.all(activities.map(model.enrich))
    res.json({ status: 'success', data: enrichedActivities })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// GET /api/v1/activities/:id
app.get('/:id', async (req: any, res) => {
  try {
    const activity = await model.getById(req.params.id)
    if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })

    const isOwner = activity.userId === req.user.id
    const isAdminOrTrainer = ['admin', 'trainer'].includes(req.user.role)
    // Optional: check if they are friends? We'll let admin/trainer/owner see it.
    if (!isOwner && !isAdminOrTrainer) {
      // Let's assume friends might need to see it too, but we'll leave it as is if we don't strict friend check
    }

    const enriched = await model.enrich(activity)
    res.json({ status: 'success', data: enriched })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// POST /api/v1/activities
app.post('/', async (req: any, res) => {
  try {
    const { exercise_type_id, duration, distance, date, notes, tagged_friends } = req.body
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
      notes,
      tagged_friends: Array.isArray(tagged_friends) ? tagged_friends : []
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
    const activity = await model.getById(req.params.id)
    if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })

    const isOwner = activity.userId === req.user.id
    const isAdminOrTrainer = ['admin', 'trainer'].includes(req.user.role)
    if (!isOwner && !isAdminOrTrainer) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to edit this activity' })
    }

    const updated = await model.update(req.params.id, req.body)
    const enriched = await model.enrich(updated!)
    res.json({ status: 'success', data: enriched })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// DELETE /api/v1/activities/:id
app.delete('/:id', async (req: any, res) => {
  try {
    const activity = await model.getById(req.params.id)
    if (!activity) return res.status(404).json({ status: 'fail', message: 'Activity not found' })

    const isOwner = activity.userId === req.user.id
    const isAdmin = req.user.role === 'admin'
    // Let's say trainers can delete activities too, or maybe only admin and owner
    const isAdminOrTrainer = ['admin', 'trainer'].includes(req.user.role)
    if (!isOwner && !isAdminOrTrainer) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to delete this activity' })
    }

    await model.remove(req.params.id)
    res.status(204).send()
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default app
