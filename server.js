require('dotenv').config();
const express = require('express');
const app = express();

// Serve your HTML files
app.use(express.static('public'));

// API route (uses env variable)
app.get('/env/data', (req, res) => {
    res.json({
        API: process.env.API_KEY,
        CLIENT: process.env.CLIENT_ID
    });
});

// Start server
app.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});