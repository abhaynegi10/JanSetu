// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { createReport, getAllReports } = require('../controllers/reportController');

// Route to submit a new report
router.post('/', createReport);

// Route to get all reports
router.get('/', getAllReports);

module.exports = router;