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
  createdAt?: string
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

// Enrich activity with user and exercise type info
export async function enrich(activity: ActivityRecord) {
  // activity has been camelCased by the get/create functions
  const exerciseTypeId = (activity as any).exerciseTypeId || (activity as any).exercise_type_id;
  const userId = (activity as any).userId || (activity as any).user_id;

  const exerciseType = await getExerciseTypeById(exerciseTypeId)
  const user = await getUserById(userId)
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
