import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ExerciseType from './models/ExerciseType.js';
import Activity from './models/Activity.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const users = [
    {
        username: 'admin',
        email: 'admin@fitness.com',
        fullName: 'Admin User',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
    },
    {
        username: 'john',
        email: 'john@fitness.com',
        fullName: 'John Doe',
        password: 'john123',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    {
        username: 'jane',
        email: 'jane@fitness.com',
        fullName: 'Jane Smith',
        password: 'jane123',
        role: 'trainer',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
    }
];

const exerciseTypes = [
    { name: 'Running', category: 'Cardio', defaultCaloriesPerMinute: 11.4 },
    { name: 'Cycling', category: 'Cardio', defaultCaloriesPerMinute: 8.5 },
    { name: 'Swimming', category: 'Cardio', defaultCaloriesPerMinute: 10.0 },
    { name: 'Walking', category: 'Cardio', defaultCaloriesPerMinute: 4.0 },
    { name: 'Weightlifting', category: 'Strength', defaultCaloriesPerMinute: 6.0 },
    { name: 'Yoga', category: 'Flexibility', defaultCaloriesPerMinute: 3.5 },
    { name: 'Plank', category: 'Balance', defaultCaloriesPerMinute: 2.0 }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB for seeding...');

        // Clear existing
        await User.deleteMany({});
        await ExerciseType.deleteMany({});
        await Activity.deleteMany({});

        // Seed Users
        const createdUsers = await User.create(users);
        console.log(`${createdUsers.length} users created.`);

        // Seed Exercise Types
        const createdTypes = await ExerciseType.create(exerciseTypes);
        console.log(`${createdTypes.length} exercise types created.`);

        // Add some friends
        const [admin, john, jane] = createdUsers;
        admin.friends.push(john._id, jane._id);
        john.friends.push(admin._id, jane._id);
        jane.friends.push(admin._id, john._id);
        await Promise.all([admin.save(), john.save(), jane.save()]);
        console.log('Friendships established.');

        // Seed some Activities for John
        const running = createdTypes.find(t => t.name === 'Running');
        const cycling = createdTypes.find(t => t.name === 'Cycling');

        await Activity.create([
            {
                userId: john._id,
                exerciseTypeId: running._id,
                duration: 30,
                distance: 5,
                calories: 30 * running.defaultCaloriesPerMinute,
                date: new Date(),
                notes: 'Morning run in the park'
            },
            {
                userId: john._id,
                exerciseTypeId: cycling._id,
                duration: 45,
                distance: 15,
                calories: 45 * cycling.defaultCaloriesPerMinute,
                date: new Date(Date.now() - 86400000),
                notes: 'Commute to work'
            }
        ]);
        console.log('Sample activities created.');

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
