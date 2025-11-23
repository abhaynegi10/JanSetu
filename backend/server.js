// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

// 👇 THIS IS THE MISSING LINE! ADD THIS.
require('./config/db'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});