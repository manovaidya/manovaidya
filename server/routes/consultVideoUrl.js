import express from "express"
const router = express.Router();
import ConsultVideoUrl from "../models/ConsultVideoUrl.js";

// Create a new consultation

router.post("/create-url", async (req, res) => {
    try {
        const { urls } = req.body;
        const consultation = ConsultVideoUrl.create({ urls })

        res.status(201).json({ status: true, message: "Consultation created successfully!", consultation, });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: false, message: "Error creating consultation", error: error.message, });
    }
});


// Get all consultations
router.get("/get-All-url", async (req, res) => {
    try {
        const consultations = await ConsultVideoUrl.find();
        res.status(200).json({ status: true, consultations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching consultations Url", error: error.message });
    }
});

// Get a specific consultation by ID
router.get("/get-url-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const consultation = await ConsultVideoUrl.findById(id);

        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.status(200).json({ status: true, consultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching consultation", error: error.message });
    }
});

// Update a consultation
router.post("/update-url/:id", async (req, res) => {
    try {
        const { urls } = req.body;  // Extracting the 'urls' from the request body

        const updatedConsultation = await ConsultVideoUrl.findByIdAndUpdate(
            req.params.id, // The ID passed in the URL
            { urls },      // The field to update
            { new: true }  // Return the updated document
        );

        if (!updatedConsultation) {
            return res.status(200).json({ message: "Consultation not found" });
        }
        res.status(200).json({ status: true, message: "Consultation updated successfully", data: updatedConsultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating consultation", error: error.message });
    }
});

// Delete a consultation
router.get("/delete-url/:id", async (req, res) => {
    try {
        const consultation = await ConsultVideoUrl.findByIdAndDelete(req.params.id);
        if (!consultation) {
            return res.status(404).json({ status: false, message: "Consultation not found" });
        }
        res.status(200).json({ status: true, message: "Consultation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting consultation", error: error.message });
    }
});

router.post("/change-status", async (req, res) => {
    try {
        const { status, urlId } = req.body;
        console.log("urlsurlsurlsurls", status)
        if (typeof status !== 'boolean') {
            return res.status(400).json({ message: "isActive must be a boolean value" });
        }

        const updatedConsultation = await ConsultVideoUrl.findByIdAndUpdate(
            urlId,
            { isActive: status },
            { new: true } // Returns the updated document
        );

        if (!updatedConsultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.status(200).json({ status: true, message: "Consultation Status Updated successfully", data: updatedConsultation, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating consultation status", error: error.message, });
    }
});

export default router;
