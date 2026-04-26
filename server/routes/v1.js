import express from 'express';
import * as authController from '../controllers/auth.js';
import * as usersController from '../controllers/users.js';
import * as activitiesController from '../controllers/activities.js';
import * as exerciseTypesController from '../controllers/exerciseTypes.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// AUTH
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// PROTECTED ROUTES
router.use(protect);

// USERS
router.get('/users', restrictTo('admin'), usersController.getAllUsers);
router.get('/users/me', usersController.getMe);
router.patch('/users/me', usersController.updateUser); // id handled by middleware in real case or use :id
router.get('/users/:id', usersController.getUser);
router.patch('/users/:id', restrictTo('admin'), usersController.updateUser);
router.delete('/users/:id', restrictTo('admin'), usersController.deleteUser);
router.post('/users/friends', usersController.addFriend);
router.delete('/users/friends/:friendId', usersController.removeFriend);

// ACTIVITIES
router.get('/activities/me', activitiesController.getMyActivities);
router.get('/activities/user/:userId', activitiesController.getUserActivities);
router.get('/activities', restrictTo('admin'), activitiesController.getAllActivities);
router.post('/activities', activitiesController.createActivity);
router.patch('/activities/:id', activitiesController.updateActivity);
router.delete('/activities/:id', activitiesController.deleteActivity);

// EXERCISE TYPES
router.get('/exerciseTypes', exerciseTypesController.getAllExerciseTypes);
router.post('/exerciseTypes', restrictTo('admin', 'trainer'), exerciseTypesController.createExerciseType);
router.patch('/exerciseTypes/:id', restrictTo('admin', 'trainer'), exerciseTypesController.updateExerciseType);
router.delete('/exerciseTypes/:id', restrictTo('admin'), exerciseTypesController.deleteExerciseType);

export default router;
