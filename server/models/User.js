import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        minlength: 3
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        select: false // Don't return password by default
    },
    fullName: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'user', 'trainer'], 
        default: 'user' 
    },
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    avatar: { 
        type: String 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
