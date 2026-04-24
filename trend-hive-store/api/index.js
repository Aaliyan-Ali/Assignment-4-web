const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder (aapki HTML, CSS, images)
app.use(express.static(path.join(__dirname, '../public')));

// ---------- In-Memory Storage ----------
let products = [
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "clothing", image: "https://picsum.photos/id/20/300/200", description: "Water-resistant, fleece-lined", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "electronics", image: "https://picsum.photos/id/1/300/200", description: "Active noise cancellation", rating: 4.5 },
    { id: 3, name: "Retro Leather Sneakers", price: 44.99, category: "footwear", image: "https://picsum.photos/id/2/300/200", description: "Premium leather", rating: 4.7 },
    { id: 4, name: "Smart LED Bulb", price: 10.99, category: "electronics", image: "https://picsum.photos/id/3/300/200", description: "WiFi + voice control", rating: 4.3 },
    { id: 5, name: "Minimalist Backpack", price: 29.99, category: "accessories", image: "https://picsum.photos/id/4/300/200", description: "Laptop compartment", rating: 4.9 },
    { id: 6, name: "Graphic Tee", price: 12.99, category: "clothing", image: "https://picsum.photos/id/5/300/200", description: "100% cotton", rating: 4.4 },
    { id: 7, name: "Wireless Mouse", price: 15.99, category: "electronics", image: "https://picsum.photos/id/6/300/200", description: "Silent clicks", rating: 4.6 },
    { id: 8, name: "Polarized Sunglasses", price: 22.99, category: "accessories", image: "https://picsum.photos/id/7/300/200", description: "UV400", rating: 4.5 },
    { id: 9, name: "Yoga Mat", price: 18.99, category: "fitness", image: "https://picsum.photos/id/8/300/200", description: "Non-slip", rating: 4.7 },
    { id: 10, name: "Analog Watch", price: 49.99, category: "accessories", image: "https://picsum.photos/id/9/300/200", description: "Stainless steel", rating: 4.8 },
    { id: 11, name: "Bluetooth Speaker", price: 34.99, category: "electronics", image: "https://picsum.photos/id/10/300/200", description: "Bass boost", rating: 4.5 },
    { id: 12, name: "Denim Jeans", price: 32.99, category: "clothing", image: "https://picsum.photos/id/11/300/200", description: "Slim fit", rating: 4.6 },
    { id: 13, name: "Sports Shoes", price: 54.99, category: "footwear", image: "https://picsum.photos/id/12/300/200", description: "Cushioning", rating: 4.7 },
    { id: 14, name: "Phone Stand", price: 6.99, category: "accessories", image: "https://picsum.photos/id/13/300/200", description: "Adjustable", rating: 4.2 },
    { id: 15, name: "Hoodie", price: 25.99, category: "clothing", image: "https://picsum.photos/id/14/300/200", description: "Warm fleece", rating: 4.8 },
    { id: 16, name: "Gaming Keyboard", price: 45.99, category: "electronics", image: "https://picsum.photos/id/15/300/200", description: "RGB mechanical", rating: 4.9 },
    { id: 17, name: "Leather Wallet", price: 14.99, category: "accessories", image: "https://picsum.photos/id/16/300/200", description: "RFID blocking", rating: 4.5 },
    { id: 18, name: "Running Shorts", price: 11.99, category: "clothing", image: "5.jpg", description: "Quick-dry", rating: 4.4 },
    { id: 19, name: "Power Bank", price: 28.99, category: "electronics", image: "7.webp", description: "20000mAh", rating: 4.7 },
    { id: 20, name: "Classic Cap", price: 8.99, category: "accessories", image: "https://picsum.photos/id/19/300/200", description: "Cotton", rating: 4.3 }
];
let nextProductId = 21;

let orders = [];
let nextOrderId = 1;

let users = [
    { id: 1, email: "demo@trendhive.com", password: "demo123", name: "Demo User" }
];
let nextUserId = 2;

// ---------- API Routes ----------

// Products
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
    const p = products.find(p => p.id === parseInt(req.params.id));
    p ? res.json(p) : res.status(404).json({ error: "Not found" });
});
app.post('/api/products', (req, res) => {
    const { name, price, category, image, description, rating } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Name & price required" });
    const newProduct = { id: nextProductId++, name, price: parseFloat(price), category, image, description, rating: rating || 4.0 };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    products[index] = { ...products[index], ...req.body, price: parseFloat(req.body.price) || products[index].price };
    res.json(products[index]);
});
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    products.splice(index, 1);
    res.json({ message: "Deleted" });
});

// Orders
app.get('/api/orders', (req, res) => res.json(orders));
app.post('/api/orders', (req, res) => {
    const { productId, productName, productImage, userEmail, customerName, comment } = req.body;
    const newOrder = { id: nextOrderId++, productId, productName, productImage, userEmail, customerName, comment, status: "Pending", createdAt: new Date().toISOString() };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});
app.put('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Not found" });
    order.status = req.body.status || order.status;
    res.json(order);
});

// Auth
app.post('/api/signup', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "User exists" });
    const newUser = { id: nextUserId++, email, password, name: name || email.split('@')[0] };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, email, name: newUser.name } });
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
});

// Deliveries (recent)
app.get('/api/deliveries', (req, res) => {
    const recent = orders.filter(o => o.status === 'Delivered').slice(-5);
    res.json(recent);
});

// Serve HTML pages (for direct access)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/products.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/products.html'));
});
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});
// Fallback for any other route to index.html (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// IMPORTANT: Export for Vercel (NO app.listen)
module.exports = app;