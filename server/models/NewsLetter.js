import mongoose from 'mongoose';

const newslaterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        default: "",
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Pre-save middleware to update the updated_at field
newslaterSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const NewsLater = mongoose.model('NewsLater', newslaterSchema);
export default NewsLater