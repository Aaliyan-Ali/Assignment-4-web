const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

let products = [
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300", description: "Water-resistant jacket", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", description: "Active noise cancellation", rating: 4.5 }
];

// API ROUTE
app.get('/api/products', (req, res) => {
    res.json(products);
});

// PAGE ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// CATCH ALL
app.get('/:page', (req, res) => {
    const page = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
    res.sendFile(path.join(publicPath, page), (err) => {
        if (err) res.sendFile(path.join(publicPath, 'index.html'));
    });
});

module.exports = app;