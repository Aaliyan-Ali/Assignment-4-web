const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Point to the public folder correctly
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Manually serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// [All his /api/ routes go here...]

// Catch-all to serve other .html files like admin.html or products.html
app.get('/:page', (req, res) => {
    const page = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
    res.sendFile(path.join(publicPath, page), (err) => {
        if (err) res.sendFile(path.join(publicPath, 'index.html'));
    });
});

module.exports = app;