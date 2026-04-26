import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    exerciseTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExerciseType',
        required: true
    },
    duration: { 
        type: Number, 
        required: true 
    }, // in minutes
    distance: { 
        type: Number, 
        default: 0 
    }, // in km
    date: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    calories: { 
        type: Number, 
        required: true 
    },
    notes: { 
        type: String, 
        trim: true 
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
