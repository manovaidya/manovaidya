import mongoose from 'mongoose';

const herbsSchema = new mongoose.Schema({
    // productId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product',
    //     required: true,
    // },
    name: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

const Herbs = mongoose.model('Herbs', herbsSchema);

export default Herbs;