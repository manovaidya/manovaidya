import mongoose from 'mongoose';
const TestResultSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    answers: [Number],
    totalScore: { type: Number },
    category: { type: String },
    recommendation: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const TestResult = mongoose.model('TestResult', TestResultSchema);

export default TestResult;