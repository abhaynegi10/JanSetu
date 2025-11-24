// backend/models/updateSchema.js
require('dotenv').config({ path: '../.env' }); // Load passwords
const pool = require('../config/db');

const addImageColumn = async () => {
    try {
        console.log("⏳ Updating Database...");
        
        // This command adds the column if it doesn't exist
        await pool.query(`
            ALTER TABLE reports 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);
        
        console.log("✅ Success! 'image_url' column added to reports table.");
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        pool.end();
    }
};

addImageColumn();