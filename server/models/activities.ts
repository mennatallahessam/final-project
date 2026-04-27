import { supabase, toCamelCase, toSnakeCase } from './supabase'
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

export async function getAll(): Promise<ActivityRecord[]> {
  const { data, error } = await supabase.from('activities').select('*')
  if (error) throw error
  return data.map(toCamelCase) as ActivityRecord[]
}

export async function getByUserId(userId: string): Promise<ActivityRecord[]> {
  const { data, error } = await supabase.from('activities').select('*').eq('user_id', userId)
  if (error) throw error
  return data.map(toCamelCase) as ActivityRecord[]
}

export async function getById(id: string): Promise<ActivityRecord | undefined> {
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as ActivityRecord : undefined
}

export async function create(data: Omit<ActivityRecord, 'id' | 'created_at'>): Promise<ActivityRecord> {
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

// Enrich activity with user and exercise type info
export async function enrich(activity: ActivityRecord) {
  const exerciseType = await getExerciseTypeById(activity.exercise_type_id)
  const user = await getUserById(activity.user_id)
  return {
    ...activity,
    exerciseType: exerciseType || null,
    user: user ? { id: user.id, username: user.username, full_name: user.full_name, avatar: user.avatar } : null
  }
}

export async function seed() {
  // Seeding activities would require existing users and exercise types
  // This is typically done after other tables are seeded
  console.log('Activities table ready for seeding')
}
