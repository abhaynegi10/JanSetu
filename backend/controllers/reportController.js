// backend/controllers/reportController.js
const pool = require('../config/db');

// --- AI LOGIC ---
const classifyReport = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('pothole') || desc.includes('road') || desc.includes('water') || desc.includes('garbage') || desc.includes('street light')) {
        return 'government';
    }
    if (desc.includes('mechanic') || desc.includes('plumber') || desc.includes('electrician') || desc.includes('cleaner') || desc.includes('repair')) {
        return 'service';
    }
    return 'pending';
};

// --- CREATE REPORT (With File) ---
const createReport = async (req, res) => {
    const { title, description, location, user_id } = req.body;
    
    // Check if a file was uploaded
    let image_url = null;
    if (req.file) {
        // Save the full URL path
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const category = classifyReport(description + ' ' + title);

        const newReport = await pool.query(
            'INSERT INTO reports (title, description, location, user_id, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, location, user_id, category, image_url]
        );

        res.status(201).json({
            message: `Report submitted! Classified as: ${category.toUpperCase()}`,
            report: newReport.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- GET ALL REPORTS ---
const getAllReports = async (req, res) => {
    try {
        const allReports = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.status(200).json(allReports.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- DELETE REPORT (New) ---
const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM reports WHERE id = $1', [id]);
        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createReport, getAllReports, deleteReport };