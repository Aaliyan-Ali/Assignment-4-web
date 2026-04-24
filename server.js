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
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=200&fit=crop", description: "Water-resistant, fleece-lined, 4 pockets", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop", description: "Active noise cancellation, 30hr battery", rating: 4.5 },
    { id: 3, name: "Retro Leather Sneakers", price: 44.99, category: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop", description: "Premium leather, anti-skid sole", rating: 4.7 },
    { id: 4, name: "Smart LED Bulb", price: 10.99, category: "electronics", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=300&h=200&fit=crop", description: "WiFi + voice control, 16M colors", rating: 4.3 },
    { id: 5, name: "Minimalist Backpack", price: 29.99, category: "accessories", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=200&fit=crop", description: "Laptop compartment, water-repellent", rating: 4.9 }
];

let orders = [
    { id: 1, productId: 2, productName: "NoiseBuds X2", productImage: "https://picsum.photos/id/1/100/100", userEmail: "demo@trendhive.com", customerName: "Aarav S.", comment: "Fast shipping!", status: "Delivered", createdAt: new Date().toISOString() }
];

// ---------- API ROUTES (MUST BE ABOVE CATCH-ALL) ----------

app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) res.json({ success: true, user });
    else res.status(401).json({ error: "Invalid credentials" });
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const newOrder = { id: Date.now(), ...req.body, status: "Pending", createdAt: new Date().toISOString() };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// ---------- PAGE ROUTING ----------

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Catch-all for other pages (products, admin, etc)
app.get('/:page', (req, res) => {
    const page = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
    res.sendFile(path.join(publicPath, page), (err) => {
        if (err) res.sendFile(path.join(publicPath, 'index.html'));
    });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
}