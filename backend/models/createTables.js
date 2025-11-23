// models/createTables.js
const pool = require('../config/db');

const createTables = async () => {
    try {
        // 1. Create Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'citizen', 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Users table created');

        // 2. Create Reports Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(255),
                category VARCHAR(50) DEFAULT 'pending', 
                status VARCHAR(50) DEFAULT 'open',
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Reports table created');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        pool.end(); // Close connection
    }
};

createTables();