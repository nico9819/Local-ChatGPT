require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet()); // Set security-related HTTP response headers
app.use(compression()); // Compress all routes
app.use(morgan('combined')); // Log HTTP requests

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle SPA routing by serving the index.html file
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Basic 404 handler
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
