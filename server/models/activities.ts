import { supabase, toCamelCase, toSnakeCase } from './supabase'
import { getById as getExerciseTypeById } from './exerciseTypes'
import { getById as getUserById } from './users'

export interface ActivityRecord {
  id: string
  userId: string
  exerciseTypeId: string
  duration: number
  distance?: number
  date: string
  calories: number
  notes?: string
  taggedFriends?: string[]
  createdAt?: string
}

export async function getAll(limit?: number, offset?: number): Promise<ActivityRecord[]> {
  let query = supabase.from('activities').select('*').order('date', { ascending: false })
  if (limit !== undefined) query = query.limit(limit)
  if (offset !== undefined) query = query.range(offset, offset + (limit || 10) - 1)
  
  const { data, error } = await query
  if (error) throw error
  return data.map(toCamelCase) as ActivityRecord[]
}

export async function getTotalCount(): Promise<number> {
  const { count, error } = await supabase.from('activities').select('*', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
}

export async function getByUserId(userId: string, limit?: number, offset?: number): Promise<ActivityRecord[]> {
  let query = supabase.from('activities').select('*').eq('user_id', userId).order('date', { ascending: false })
  if (limit !== undefined) query = query.limit(limit)
  if (offset !== undefined) query = query.range(offset, offset + (limit || 10) - 1)

  const { data, error } = await query
  if (error) throw error
  return data.map(toCamelCase) as ActivityRecord[]
}

export async function getUserTotalCount(userId: string): Promise<number> {
  const { count, error } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  if (error) throw error
  return count || 0
}

export async function getById(id: string): Promise<ActivityRecord | undefined> {
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as ActivityRecord : undefined
}

export async function create(data: Omit<ActivityRecord, 'id' | 'createdAt'> | any): Promise<ActivityRecord> {
  const snakeCaseData = toSnakeCase(data)
  const { data: insertedData, error } = await supabase
    .from('activities')
    .insert([snakeCaseData])
    .select()
    .single()
  if (error) throw error
  return toCamelCase(insertedData) as ActivityRecord
}

export async function update(id: string, data: Partial<ActivityRecord>): Promise<ActivityRecord | undefined> {
  const snakeCaseData = toSnakeCase(data)
  const { data: updatedData, error } = await supabase
    .from('activities')
    .update(snakeCaseData)
    .eq('id', id)
    .select()
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return updatedData ? toCamelCase(updatedData) as ActivityRecord : undefined
}

export async function remove(id: string): Promise<boolean> {
  const { error } = await supabase.from('activities').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function enrich(activity: ActivityRecord) {
  const exerciseTypeId = (activity as any).exerciseTypeId || (activity as any).exercise_type_id;
  const userId = (activity as any).userId || (activity as any).user_id;

  const exerciseType = await getExerciseTypeById(exerciseTypeId)
  const user = await getUserById(userId)
  
  // Tagged friends
  const taggedFriendsIds = activity.taggedFriends || (activity as any).tagged_friends || []
  const taggedFriends = await Promise.all(taggedFriendsIds.map(async (id: string) => {
    const u = await getUserById(id)
    return u ? { id: u.id, username: u.username, full_name: u.full_name, avatar: u.avatar } : null
  }))

  return {
    ...activity,
    exerciseType: exerciseType || null,
    user: user ? { id: user.id, username: user.username, full_name: user.full_name, avatar: user.avatar } : null,
    taggedFriends: taggedFriends.filter(Boolean)
  }
}

export async function seed() {
  const { getAll: getAllUsers } = await import('./users')
  const { getAll: getAllExerciseTypes } = await import('./exerciseTypes')
  
  const users = await getAllUsers()
  const exerciseTypes = await getAllExerciseTypes()
  
  if (users.length === 0 || exerciseTypes.length === 0) return

  const count = await getTotalCount()
  if (count >= 50) return

  const activitiesToInsert = []
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const type = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)]
    const date = new Date()
    date.setDate(date.getDate() - i)

    activitiesToInsert.push(toSnakeCase({
      userId: user.id,
      exerciseTypeId: type.id,
      duration: Math.floor(Math.random() * 60) + 15,
      distance: Math.random() > 0.5 ? (Math.random() * 10).toFixed(2) : null,
      date: date.toISOString().split('T')[0],
      calories: Math.floor(Math.random() * 500) + 100,
      notes: `Seed activity #${i + 1} - ${type.name}`
    }))
  }

  const { error } = await supabase.from('activities').insert(activitiesToInsert)
  if (error) throw error
}
