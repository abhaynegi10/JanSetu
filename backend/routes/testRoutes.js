// routes/testRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller we just made
const { getTestMessage } = require('../controllers/testController');

// When someone goes to '/test', run the controller function
router.get('/test', getTestMessage);

module.exports = router;