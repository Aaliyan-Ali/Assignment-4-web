const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VERCEL FIX: Use process.cwd() for absolute pathing
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// ---------- IN-MEMORY STORAGE ----------
let users = [{ id: 1, email: 'demo@trendhive.com', password: 'demo123', name: 'Demo User' }];
let products = [
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300", description: "Water-resistant, fleece-lined", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", description: "Active noise cancellation", rating: 4.5 },
    { id: 3, name: "Retro Leather Sneakers", price: 44.99, category: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300", description: "Premium leather", rating: 4.7 },
    { id: 4, name: "Smart LED Bulb", price: 10.99, category: "electronics", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=300", description: "WiFi control", rating: 4.3 },
    { id: 5, name: "Minimalist Backpack", price: 29.99, category: "accessories", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300", description: "Laptop compartment", rating: 4.9 },
    { id: 6, name: "Graphic Tee", price: 12.99, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", description: "100% cotton", rating: 4.4 }
];
let orders = [];

// ---------- API ROUTES ----------
app.get('/api/products', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(products));
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) res.json({ success: true, user });
    else res.status(401).json({ error: "Invalid credentials" });
});

app.get('/api/orders', (req, res) => res.json(orders));

// ---------- PAGE ROUTING ----------
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
    res.sendFile(path.join(publicPath, page), (err) => {
        if (err) res.sendFile(path.join(publicPath, 'index.html'));
    });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log("Local: http://localhost:3000"));
}