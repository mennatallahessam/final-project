import { supabase, toCamelCase, toSnakeCase } from './supabase'

export interface ExerciseType {
  id: string
  name: string
  defaultCaloriesPerMinute: number
}

export async function getAll(): Promise<ExerciseType[]> {
  const { data, error } = await supabase.from('exercise_types').select('*')
  if (error) throw error
  return data.map(toCamelCase) as ExerciseType[]
}

export async function getById(id: string): Promise<ExerciseType | undefined> {
  const { data, error } = await supabase.from('exercise_types').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as ExerciseType : undefined
}

export async function create(data: Omit<ExerciseType, 'id'>): Promise<ExerciseType> {
  const snakeCaseData = toSnakeCase(data)
  const { data: insertedData, error } = await supabase
    .from('exercise_types')
    .insert([snakeCaseData])
    .select()
    .single()
  if (error) throw error
  return toCamelCase(insertedData) as ExerciseType
}

export async function update(id: string, data: Partial<ExerciseType>): Promise<ExerciseType | undefined> {
  const snakeCaseData = toSnakeCase(data)
  const { data: updatedData, error } = await supabase
    .from('exercise_types')
    .update(snakeCaseData)
    .eq('id', id)
    .select()
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return updatedData ? toCamelCase(updatedData) as ExerciseType : undefined
}

export async function remove(id: string): Promise<boolean> {
  const { error } = await supabase.from('exercise_types').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function seed() {
  const seedTypes = [
    { name: 'Running', default_calories_per_minute: 10 },
    { name: 'Walking', default_calories_per_minute: 4 },
    { name: 'Cycling', default_calories_per_minute: 8 },
    { name: 'Swimming', default_calories_per_minute: 12 }
  ]

  for (const type of seedTypes) {
    const { data: existing } = await supabase.from('exercise_types').select('*').eq('name', type.name).single()
    if (!existing) {
      await supabase.from('exercise_types').insert([type])
      console.log(`Created exercise type: ${type.name}`)
    }
  }
}
