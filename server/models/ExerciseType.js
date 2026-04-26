import mongoose from 'mongoose';

const exerciseTypeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Sport', 'Other'],
        default: 'Other'
    },
    defaultCaloriesPerMinute: { 
        type: Number, 
        required: true,
        default: 5
    }
}, {
    timestamps: true
});

const ExerciseType = mongoose.model('ExerciseType', exerciseTypeSchema);

export default ExerciseType;
