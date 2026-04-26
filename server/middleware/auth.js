import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes by verifying the JWT token.
 * Extends the request object with the user data.
 */
export async function protect(req, res, next) {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists' });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

/**
 * Middleware to restrict access to specific roles.
 */
export function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
}
