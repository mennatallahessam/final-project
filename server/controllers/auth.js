import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate a JWT token for a user
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

/**
 * Create and send token in response
 */
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

/**
 * Register a new user
 */
export async function register(req, res) {
    try {
        const { username, email, fullName, password, role } = req.body;

        // Auto-generate avatar if not provided
        const avatar = req.body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;

        const newUser = await User.create({
            username,
            email,
            fullName,
            password,
            role,
            avatar
        });

        createSendToken(newUser, 201, res);
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

/**
 * Log in a user
 */
export async function login(req, res) {
    try {
        const { username, password } = req.body;

        // 1) Check if username and password exist
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ username }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}
