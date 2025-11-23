// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// When someone POSTs data to /register, run the logic
router.post('/register', registerUser);

module.exports = router;