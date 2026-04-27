import { supabase, toCamelCase, toSnakeCase } from './supabase'

export interface ExerciseTypeRecord {
  id: string
  name: string
  default_calories_per_minute: number
  created_at?: string
}

export async function getAll(): Promise<ExerciseTypeRecord[]> {
  const { data, error } = await supabase.from('exercise_types').select('*')
  if (error) throw error
  return data.map(toCamelCase) as ExerciseTypeRecord[]
}

export async function getById(id: string): Promise<ExerciseTypeRecord | undefined> {
  const { data, error } = await supabase.from('exercise_types').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as ExerciseTypeRecord : undefined
}

export async function create(data: Omit<ExerciseTypeRecord, 'id' | 'created_at'>): Promise<ExerciseTypeRecord> {
  const snakeCaseData = toSnakeCase(data)
  const { data: insertedData, error } = await supabase
    .from('exercise_types')
    .insert([snakeCaseData])
    .select()
    .single()
  if (error) throw error
  return toCamelCase(insertedData) as ExerciseTypeRecord
}

export async function seed() {
  const exerciseTypes = [
    { name: 'Running', default_calories_per_minute: 15 },
    { name: 'Walking', default_calories_per_minute: 5 },
    { name: 'Cycling', default_calories_per_minute: 12 },
    { name: 'Swimming', default_calories_per_minute: 11 },
    { name: 'Gym Workout', default_calories_per_minute: 10 }
  ]

  for (const type of exerciseTypes) {
    const { data: existing, error: selectError } = await supabase
      .from('exercise_types')
      .select('id')
      .eq('name', type.name)
      .single()
    
    if (!existing && (!selectError || selectError.code === 'PGRST116')) {
      await create(type)
      console.log(`Created exercise type: ${type.name}`)
    }
  }
}
