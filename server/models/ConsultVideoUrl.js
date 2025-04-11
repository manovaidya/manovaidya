import mongoose from 'mongoose';

const ConsultVideoUrlSchema = new mongoose.Schema({

    urls: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const ConsultVideoUrl = mongoose.model('ConsultVideoUrl', ConsultVideoUrlSchema);

export default ConsultVideoUrl;
