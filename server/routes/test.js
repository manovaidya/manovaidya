import express from 'express';
import TestResult from '../models/TestResult.js';
import AddHealthTest from '../models/AddHealthTest.js';


const router = express.Router();

const calculateRecommendation = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage <= 33) return { category: 'Mild', recommendation: 'Anxiety medicine combo for 4-6 months' };
    if (percentage <= 66) return { category: 'Moderate', recommendation: 'Anxiety medicine combo for 6 months to 1 year' };
    return { category: 'Severe', recommendation: 'Anxiety medicine combo for 1 to 2 years' };
};

router.post('/submit-test', async (req, res) => {
    const { userName, answers } = req.body;
    const maxScore = 4 * 15; // 15 questions, max score of 4 per question
    const totalScore = answers.reduce((acc, answer) => acc + answer, 0);

    const { category, recommendation } = calculateRecommendation(totalScore, maxScore);

    const newTestResult = new TestResult({
        userName,
        answers,
        totalScore,
        category,
        recommendation,
    });

    try {
        await newTestResult.save();
        res.status(200).json({ status: true, message: 'Test results saved successfully', testResult: newTestResult });
    } catch (err) {
        res.status(500).json({ message: 'Error saving test results', error: err });
    }
});

router.post('/create-mind-health-test', async (req, res) => {
    try {
        const { addHeaderTitle, keyPoint, description, questions, productUrl, themeColor,videoUrl} = req.body;

        if (!themeColor || !addHeaderTitle || !keyPoint || !description || !Array.isArray(questions) || !Array.isArray(productUrl)|| !Array.isArray(videoUrl)) {
            return res.status(200).json({ status: false, message: "Invalid input data. Please ensure all fields are filled correctly." });
        }

        const findTest = await AddHealthTest.findOne({ addHeaderTitle });

        if (findTest) {
            return res.status(200).json({ status: false, message: 'Health test already exists.' });
        }

        const newTest = new AddHealthTest({ addHeaderTitle, keyPoint, description, questions, productUrl, videoUrl, themeColor });

        const savedTest = await newTest.save();

        res.status(201).json({ status: true, message: 'Health test created successfully', data: savedTest });

    } catch (error) {
        console.error("Error creating health test:", error);
        res.status(500).json({ status: false, message: 'Server error. Unable to create the test.', error: error.message });
    }
});

router.post('/get-mind-test', async (req, res) => {
    try {
        const tests = await AddHealthTest.find()
        res.status(200).json({ status: true, message: "Mind health tests retrieved successfully.", data: tests });

    } catch (error) {
        console.error("Error retrieving mind health tests:", error);
        res.status(500).json({ message: 'Server error. Unable to retrieve the tests.', error: error.message });
    }
});

router.get('/get-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the test id from the route parameter

        // Validate page and limit
        const test = await AddHealthTest.findById(id); // Fetch the specific test by ID

        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }
        res.status(200).json({ status: true, message: "Mind health test retrieved successfully.", data: test, });

    } catch (error) {
        console.error("Error retrieving mind health test:", error);
        res.status(500).json({ message: 'Server error. Unable to retrieve the test.', error: error.message });
    }
});

router.post('/update-mind-health-test/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const test = await AddHealthTest.findByIdAndUpdate(id, updateData, { new: true });

        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }

        res.status(200).json({ status: true, message: "Mind health test updated successfully.", data: test, });

    } catch (error) {
        console.error("Error updating mind health test:", error);
        res.status(500).json({ message: 'Server error. Unable to update the test.', error: error.message });
    }
});

router.post('/delete-mindTest/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTest = await AddHealthTest.findByIdAndDelete(id);

        if (!deletedTest) {
            return res.status(404).json({ message: "Test not found." });
        }
        res.status(200).json({ status: true, message: "Mind health test deleted successfully.", data: deletedTest, });

    } catch (error) {
        console.error("Error deleting mind health test:", error);
        res.status(500).json({ message: 'Server error. Unable to delete the test.', error: error.message });
    }
});






export default router