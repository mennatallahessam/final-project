import { seed as seedUsers } from './users'
import { seed as seedExerciseTypes } from './exerciseTypes'
import { seed as seedActivities } from './activities'

async function runSeeding() {
  try {
    console.log('Starting Database Seeding...')
    
    // Seed independent tables first
    await seedUsers()
    await seedExerciseTypes()
    
    // Seed dependent tables
    await seedActivities()
    
    console.log('Seeding Completed Successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  }
}

runSeeding()
