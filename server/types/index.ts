export type { DataEnvelope, DataListEnvelope } from "./dataEnvelopes"

export type UserRole = 'user' | 'admin' | 'trainer'

export interface User {
  id: string
  username: string
  email: string
  full_name: string
  avatar?: string
  role: UserRole
  created_at?: string
}

export interface ExerciseType {
  id: string
  name: string
  default_calories_per_minute: number
  created_at?: string
}

export interface Activity {
  id: string
  user_id: string
  exercise_type_id: string
  duration: number
  distance?: number
  date: string
  calories?: number
  notes?: string
  created_at?: string
}
