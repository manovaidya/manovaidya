import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,   // ✅ Typo fixed
        trim: true,
    },
    tagColor: {
        type: String,
        required: true,
        default: "#000000",
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

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

export default Tag;
