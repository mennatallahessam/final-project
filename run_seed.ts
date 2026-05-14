import { seed } from './server/models/seed_data'

seed().then(() => {
    console.log('Seed successful')
    process.exit(0)
}).catch(err => {
    console.error('Seed failed', err)
    process.exit(1)
})
