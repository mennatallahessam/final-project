import { readJson, writeJson, generateId } from './jsonStore'

export interface ExerciseTypeRecord {
  id: string
  name: string
  default_calories_per_minute: number
}

const FILE = 'exerciseTypes.json'

export function getAll(): ExerciseTypeRecord[] {
  return readJson<ExerciseTypeRecord>(FILE)
}

export function getById(id: string): ExerciseTypeRecord | undefined {
  return getAll().find(et => et.id === id)
}

export function create(data: Omit<ExerciseTypeRecord, 'id'>): ExerciseTypeRecord {
  const types = getAll()
  const type: ExerciseTypeRecord = { ...data, id: generateId() }
  types.push(type)
  writeJson(FILE, types)
  return type
}
