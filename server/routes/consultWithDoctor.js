import express from "express"
const router = express.Router();
import Consultation from '../models/ConsultWithDoctor.js'
import { sendThankYouForBookingConsultation } from '../middleware/mail.js'
import mongoose from "mongoose";
// Create a new consultation
router.post("/create-consultation", async (req, res) => {
    try {
        const { patientName, concernChallenge, userId, email, phone, scheduleCalendar, scheduleTime, chooseDoctor, payment_id } = req.body;
        console.log("XXXXXXXXXXX", userId)

        const newConsultation = new Consultation({
            patientName,
            concernChallenge,
            email,
            phone,
            scheduleCalendar,
            scheduleTime,
            chooseDoctor,
            payment_id,
            amount: 1599,
            userId
        });

        const consultation = await newConsultation.save();
        sendThankYouForBookingConsultation(consultation)

        res.status(201).json({ status: true, message: "Consultation created successfully!", consultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Error creating consultation", error: error.message });
    }
});

// Get all consultations
router.get("/all-consultation", async (req, res) => {
    try {
        const consultations = await Consultation.find();
        res.status(200).json({ status: true, consultations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching consultations", error: error.message });
    }
});

// Get a specific consultation by ID
router.get("/get-consultation-user/:id", async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);

        const consultation = await Consultation.find({ userId: userId });

        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.status(200).json({ status: true, data: consultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching consultation", error: error.message });
    }
});

// Update a consultation
router.put("/:id", async (req, res) => {
    try {
        const { patientName, concernChallenge, email, phone, scheduleCalendar, scheduleTime, chooseDoctor, payment_id } = req.body;

        const updatedConsultation = await Consultation.findByIdAndUpdate(
            req.params.id,
            { patientName, concernChallenge, email, phone, scheduleCalendar, scheduleTime, chooseDoctor, payment_id },
            { new: true }
        );

        if (!updatedConsultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.status(200).json({ message: "Consultation updated successfully", data: updatedConsultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating consultation", error: error.message });
    }
});

// Delete a consultation
router.get("/delete-consultation/:id", async (req, res) => {
    try {
        const consultation = await Consultation.findByIdAndDelete(req.params.id);
        if (!consultation) {
            return res.status(404).json({ status: false, message: "Consultation not found" });
        }
        res.status(200).json({ status: true, message: "Consultation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting consultation", error: error.message });
    }
});

router.post("/change-status/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["pending", "completed", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value. It should be one of: pending, completed, or cancelled." });
        }

        const updatedConsultation = await Consultation.findByIdAndUpdate(req.params.id, { status: status }, { new: true });

        if (!updatedConsultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.status(200).json({ status: true, message: "Consultation Status Updated successfully", data: updatedConsultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating consultation status", error: error.message });
    }
});


export default router;
