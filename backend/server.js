// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// 1. IMPORT PATH
const path = require('path');

const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// 2. SERVE STATIC FILES (Images)
// If URL starts with /uploads, look in the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});