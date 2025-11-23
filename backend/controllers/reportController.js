// backend/controllers/reportController.js
const pool = require('../config/db');

// --- THE "DUMMY AI" LOGIC ---
const classifyReport = (description) => {
    const desc = description.toLowerCase();

    // Keywords for Government Issues
    if (desc.includes('pothole') || desc.includes('road') || desc.includes('water') || desc.includes('garbage') || desc.includes('street light')) {
        return 'government';
    }
    
    // Keywords for Service/Job Opportunities
    if (desc.includes('mechanic') || desc.includes('plumber') || desc.includes('electrician') || desc.includes('cleaner') || desc.includes('repair')) {
        return 'service';
    }

    // If unsure
    return 'pending';
};
// ----------------------------

const createReport = async (req, res) => {
    const { title, description, location, user_id } = req.body;

    try {
        // 1. Run the "AI" classification
        const category = classifyReport(description + ' ' + title);

        // 2. Insert into database WITH the category
        const newReport = await pool.query(
            'INSERT INTO reports (title, description, location, user_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, location, user_id, category]
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

const getAllReports = async (req, res) => {
    try {
        const allReports = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.status(200).json(allReports.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createReport, getAllReports };