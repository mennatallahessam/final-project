import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongo from './models/mongo.js';
import v1Router from './routes/v1.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for client communication
app.use(morgan('dev')); // Logger
app.use(express.json()); // Body parser

// Static files (for production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/dist'));
}

// Connect to Database
mongo.connect();

// Routes
app.use('/api/v1', v1Router);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
