import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

/**
 * Connect to MongoDB
 */
export async function connect() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // Do not exit process in some environments, but for dev it's helpful
        // process.exit(1);
    }
}

/**
 * Centralized DB Access (Optional helpers could go here)
 * Most interaction will happen through Mongoose models.
 */
export default {
    connect
};
