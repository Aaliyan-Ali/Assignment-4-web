const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VERCEL FIX: Use absolute path for the public folder
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ---------- IN-MEMORY STORAGE ----------
let users = [
    { id: 1, email: 'demo@trendhive.com', password: 'demo123', name: 'Demo User' }
];
let nextUserId = 2;

let products = [
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=200&fit=crop", description: "Water-resistant, fleece-lined, 4 pockets", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop", description: "Active noise cancellation, 30hr battery", rating: 4.5 },
    { id: 3, name: "Retro Leather Sneakers", price: 44.99, category: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop", description: "Premium leather, anti-skid sole", rating: 4.7 },
    { id: 4, name: "Smart LED Bulb", price: 10.99, category: "electronics", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=300&h=200&fit=crop", description: "WiFi + voice control", rating: 4.3 },
    { id: 5, name: "Minimalist Backpack", price: 29.99, category: "accessories", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=200&fit=crop", description: "Laptop compartment", rating: 4.9 }
];
let nextProductId = 6;

let orders = [
    { id: 1, productId: 2, productName: "NoiseBuds X2", productImage: "https://picsum.photos/id/1/100/100", userEmail: "demo@trendhive.com", customerName: "Aarav S.", comment: "Fast shipping!", status: "Delivered", createdAt: new Date().toISOString() }
];
let nextOrderId = 2;

// ---------- API ROUTES ----------

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', (req, res) => {
    const product = { id: nextProductId++, ...req.body };
    products.push(product);
    res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: "Deleted" });
});

app.post('/api/signup', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "Exists" });
    users.push({ id: nextUserId++, email, password, name });
    res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const user = users.find(u => u.email === req.body.email && u.password === req.body.password);
    if (!user) return res.status(401).json({ error: "Invalid" });
    res.json({ success: true, user });
});

app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/orders', (req, res) => {
    const newOrder = { id: nextOrderId++, status: "Pending", createdAt: new Date().toISOString(), ...req.body };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) order.status = req.body.status;
    res.json(order);
});

// ---------- VERCEL ROUTING FIX ----------
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.includes('.html')) {
        res.sendFile(path.join(publicPath, page));
    } else {
        res.sendFile(path.join(publicPath, 'index.html'));
    }
});

// For Vercel production
module.exports = app;

// For local development
if (require.main === module) {
    app.listen(PORT, () => console.log(`🔥 Server running at http://localhost:${PORT}`));
}