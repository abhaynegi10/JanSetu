// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createReport, getAllReports, deleteReport } = require('../controllers/reportController');

// 1. CONFIGURE STORAGE (Where to save files)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save in 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Name file: fieldname-timestamp.jpg
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. ROUTES
// POST: Use upload.single('image') to handle the file
router.post('/', upload.single('image'), createReport);

// GET: Get all
router.get('/', getAllReports);

// DELETE: Remove a report by ID
router.delete('/:id', deleteReport);

module.exports = router;