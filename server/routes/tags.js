// routes/tagRoutes.js
import express from 'express';
import Tag from '../models/Tags.js';

const router = express.Router();

// ➡️ CREATE Tag
router.post("/create-tags", async (req, res) => {
    try {
        const { tagName, tagColor } = req.body;
        console.log("Tag Create Request:", req.body);
        if (!tagName) {
            return res.status(200).json({ status: false, message: "Tag Name is required" });
        }
        const existTag = await Tag.findOne({ tagName: tagName }); // ❗ Corrected with await

        if (existTag) {
            return res.status(200).json({ status: false, message: "Tag Name already exists" });
        }
        const newTag = new Tag({ tagName, tagColor });
        await newTag.save();
        res.status(201).json({ status: true, message: "Tag created successfully", tag: newTag });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// // ➡️ READ All Tags
router.get("/get-all-tags", async (req, res) => {
    try {
        const tags = await Tag.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, data: tags });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/get-tag-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ status: false, message: "Tag not found" });
        }
        res.status(200).json({ status: true, data: tag });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// // ➡️ UPDATE Tag
router.post("/update-tags/:id", async (req, res) => {
    try {
        const { tagName, tagColor } = req.body;
        const updatedTag = await Tag.findByIdAndUpdate(req.params.id, { tagName, tagColor }, { new: true });
        if (!updatedTag) return res.status(404).json({ message: "Tag not found" });
        res.status(200).json({ message: "Tag updated successfully", status: true, tag: updatedTag });
    } catch (errorfalse) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// // ➡️ DELETE Tag
router.get("/delete-tags/:id", async (req, res) => {
    try {
        const deletedTag = await Tag.findByIdAndDelete(req.params.id);
        if (!deletedTag) return res.status(404).json({ message: "Tag not found" });
        res.status(200).json({ status: true, message: "Tag deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
