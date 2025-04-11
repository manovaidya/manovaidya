import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
});

// Define the schema for product URLs and percentage
const productUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    per: {
        type: String,
        required: true,
    },
});

const videoUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
})
// Define the AddHealthTest schema
const addHealthTestSchema = new mongoose.Schema(
    {
        addHeaderTitle: {
            type: String,
            required: true,
        },
        keyPoint: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        themeColor: {
            type: String,
            required: true,
        },
        questions: [questionSchema], // Array of question objects
        productUrl: [productUrlSchema], // Array of product URL objects
        videoUrl:[videoUrlSchema],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Create and export the model
const AddHealthTest = mongoose.model('AddHealthTest', addHealthTestSchema);

export default AddHealthTest;
