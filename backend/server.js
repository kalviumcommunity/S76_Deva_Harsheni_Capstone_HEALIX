// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const connectDatabase = require('./Database')

app.use(cors());
app.use(express.json());

connectDatabase();


// Routes
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));


// Base route
app.get('/', (req, res) => {
  res.send('Digital Pet Health Tracker API is running');
});

// Start server

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

module.exports = app;