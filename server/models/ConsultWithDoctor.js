import e from "express";
import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    concernChallenge: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    scheduleCalendar: {
        type: Date,
        required: true
    },
    scheduleTime: {
        type: String,
        required: true
    },
    chooseDoctor: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation