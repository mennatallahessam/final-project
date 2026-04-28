import { seed as seedUsers } from './users'
import { seed as seedExerciseTypes } from './exerciseTypes'
import { seed as seedActivities } from './activities'

export async function seed() {
  try {
    console.log('Starting Database Seeding...')
    
    // Seed independent tables first
    await seedUsers()
    await seedExerciseTypes()
    
    // Seed dependent tables
    await seedActivities()
    
    console.log('Seeding Completed Successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error;
  }
}
