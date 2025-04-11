import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pinCode: String,
        country: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    profilePic: {
        type: String
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', userSchema);

export default User;