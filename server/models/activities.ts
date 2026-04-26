import { readJson, writeJson, generateId } from './jsonStore'
import { getById as getExerciseTypeById } from './exerciseTypes'
import { getById as getUserById } from './users'

export interface ActivityRecord {
  id: string
  user_id: string
  exercise_type_id: string
  duration: number
  distance?: number
  date: string
  calories: number
  notes?: string
  created_at?: string
}

const FILE = 'activities.json'

export function getAll(): ActivityRecord[] {
  return readJson<ActivityRecord>(FILE)
}

export function getByUserId(userId: string): ActivityRecord[] {
  return getAll().filter(a => a.user_id === userId)
}

export function getById(id: string): ActivityRecord | undefined {
  return getAll().find(a => a.id === id)
}

export function create(data: Omit<ActivityRecord, 'id' | 'created_at'>): ActivityRecord {
  const activities = getAll()
  const activity: ActivityRecord = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString()
  }
  activities.push(activity)
  writeJson(FILE, activities)
  return activity
}

export function update(id: string, data: Partial<ActivityRecord>): ActivityRecord | undefined {
  const activities = getAll()
  const index = activities.findIndex(a => a.id === id)
  if (index === -1) return undefined
  activities[index] = { ...activities[index], ...data }
  writeJson(FILE, activities)
  return activities[index]
}

export function remove(id: string): boolean {
  const activities = getAll()
  const filtered = activities.filter(a => a.id !== id)
  if (filtered.length === activities.length) return false
  writeJson(FILE, filtered)
  return true
}

// Enrich activity with user and exercise type info
export function enrich(activity: ActivityRecord) {
  const exerciseType = getExerciseTypeById(activity.exercise_type_id)
  const user = getUserById(activity.user_id)
  return {
    ...activity,
    exerciseType: exerciseType || null,
    user: user ? { id: user.id, username: user.username, full_name: user.full_name, avatar: user.avatar } : null
  }
}
