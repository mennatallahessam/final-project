import Activity from '../models/Activity.js';
import ExerciseType from '../models/ExerciseType.js';

/**
 * Get all activities (Admin only)
 */
export async function getAllActivities(req, res) {
    try {
        const activities = await Activity.find().populate('userId', 'username fullName avatar').populate('exerciseTypeId', 'name');
        res.status(200).json({ status: 'success', data: activities });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

/**
 * Get my activities
 */
export async function getMyActivities(req, res) {
    try {
        const activities = await Activity.find({ userId: req.user._id }).populate('exerciseTypeId', 'name');
        res.status(200).json({ status: 'success', data: activities });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

/**
 * Get activities of a specific user (if they are a friend or if user is admin)
 */
export async function getUserActivities(req, res) {
    try {
        const targetUserId = req.params.userId;

        // Security check: Is the user a friend or admin?
        const isSelf = targetUserId === req.user._id.toString();
        const isFriend = req.user.friends.includes(targetUserId);
        const isAdmin = req.user.role === 'admin';

        if (!isSelf && !isFriend && !isAdmin) {
            return res.status(403).json({ message: 'You can only view activities of your friends.' });
        }

        const activities = await Activity.find({ userId: targetUserId }).populate('exerciseTypeId', 'name');
        res.status(200).json({ status: 'success', data: activities });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

/**
 * Create a new activity
 */
export async function createActivity(req, res) {
    try {
        const { exerciseTypeId, duration, distance, date, notes } = req.body;

        // Calculate calories based on ExerciseType metabolic rate
        const exerciseType = await ExerciseType.findById(exerciseTypeId);
        if (!exerciseType) {
            return res.status(404).json({ message: 'Exercise type not found' });
        }

        const calories = duration * exerciseType.defaultCaloriesPerMinute;

        const newActivity = await Activity.create({
            userId: req.user._id,
            exerciseTypeId,
            duration,
            distance,
            date,
            calories,
            notes
        });

        res.status(201).json({ status: 'success', data: newActivity });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

/**
 * Update an activity (Ownership verified)
 */
export async function updateActivity(req, res) {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Ownership check
        if (activity.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to update this activity' });
        }

        // If duration or exercise type changed, recalculate calories
        if (req.body.duration || req.body.exerciseTypeId) {
            const eid = req.body.exerciseTypeId || activity.exerciseTypeId;
            const dur = req.body.duration || activity.duration;
            const et = await ExerciseType.findById(eid);
            req.body.calories = dur * et.defaultCaloriesPerMinute;
        }

        const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', data: updatedActivity });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

/**
 * Delete an activity (Ownership verified)
 */
export async function deleteActivity(req, res) {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Ownership check
        if (activity.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this activity' });
        }

        await Activity.findByIdAndDelete(req.params.id);

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}
