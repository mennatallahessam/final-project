import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getById, enrichUser } from '../models/users'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'fittrack-super-secret-key-2026'

export function signToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' })
}

export async function protect(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Not authorized, no token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const user = getById(decoded.id)
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User belonging to this token no longer exists' })
    }
    // Attach enriched user to request (without password, with friends populated)
    req.user = enrichUser(user)
    next()
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' })
  }
}

export function restrictTo(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' })
    }
    next()
  }
}
