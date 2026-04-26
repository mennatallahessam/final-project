import ExerciseType from '../models/ExerciseType.js';

export async function getAllExerciseTypes(req, res) {
    try {
        const types = await ExerciseType.find();
        res.status(200).json({ status: 'success', data: types });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function createExerciseType(req, res) {
    try {
        const newType = await ExerciseType.create(req.body);
        res.status(201).json({ status: 'success', data: newType });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function updateExerciseType(req, res) {
    try {
        const updated = await ExerciseType.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function deleteExerciseType(req, res) {
    try {
        await ExerciseType.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}
