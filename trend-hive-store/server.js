const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ---------- IN-MEMORY STORAGE ----------

// Users array for signup/login
let users = [
    { id: 1, email: 'demo@trendhive.com', password: 'demo123', name: 'Demo User' }
];
let nextUserId = 2;

// Products (20 items in USD)
let products = [
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=200&fit=crop", description: "Water-resistant, fleece-lined, 4 pockets", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop", description: "Active noise cancellation, 30hr battery", rating: 4.5 },
    { id: 3, name: "Retro Leather Sneakers", price: 44.99, category: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop", description: "Premium leather, anti-skid sole", rating: 4.7 },
    { id: 4, name: "Smart LED Bulb", price: 10.99, category: "electronics", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=300&h=200&fit=crop", description: "WiFi + voice control, 16M colors", rating: 4.3 },
    { id: 5, name: "Minimalist Backpack", price: 29.99, category: "accessories", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=200&fit=crop", description: "Laptop compartment, water-repellent", rating: 4.9 },
    { id: 6, name: "Graphic Tee", price: 12.99, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop", description: "100% cotton, oversized fit", rating: 4.4 },
    { id: 7, name: "Wireless Mouse", price: 15.99, category: "electronics", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&h=200&fit=crop", description: "Silent clicks, ergonomic", rating: 4.6 },
    { id: 8, name: "Polarized Sunglasses", price: 22.99, category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop", description: "UV400, metal frame", rating: 4.5 },
    { id: 9, name: "Yoga Mat", price: 18.99, category: "fitness", image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=300&h=200&fit=crop", description: "Non-slip, 6mm thick", rating: 4.7 },
    { id: 10, name: "Analog Watch", price: 49.99, category: "accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=200&fit=crop", description: "Stainless steel, water resistant", rating: 4.8 },
    { id: 11, name: "Bluetooth Speaker", price: 34.99, category: "electronics", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop", description: "Bass boost, 12hr playtime", rating: 4.5 },
    { id: 12, name: "Denim Jeans", price: 32.99, category: "clothing", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=200&fit=crop", description: "Slim fit, stretchable", rating: 4.6 },
    { id: 13, name: "Sports Shoes", price: 54.99, category: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop", description: "Cushioning, breathable mesh", rating: 4.7 },
    { id: 14, name: "Phone Stand", price: 6.99, category: "accessories", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop", description: "Adjustable, foldable", rating: 4.2 },
    { id: 15, name: "Hoodie", price: 25.99, category: "clothing", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop", description: "Warm fleece, kangaroo pocket", rating: 4.8 },
    { id: 16, name: "Gaming Keyboard", price: 45.99, category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop", description: "RGB, mechanical switches", rating: 4.9 },
    { id: 17, name: "Leather Wallet", price: 14.99, category: "accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=200&fit=crop", description: "RFID blocking, 8 card slots", rating: 4.5 },
    { id: 18, name: "Running Shorts", price: 11.99, category: "clothing", image: "https://images.unsplash.com/photo-1565693413579-8c2f1d2b4c0e?w=300&h=200&fit=crop", description: "Quick-dry, 2-in-1 liner", rating: 4.4 },
    { id: 19, name: "Power Bank 20000mAh", price: 28.99, category: "electronics", image: "https://images.unsplash.com/photo-1609592424521-5f3c97351b4c?w=300&h=200&fit=crop", description: "Fast charge, dual USB", rating: 4.7 },
    { id: 20, name: "Classic Cap", price: 8.99, category: "accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=200&fit=crop", description: "Cotton, adjustable strap", rating: 4.3 }
];
let nextProductId = 21;

// Orders (deliveries) - each order has product info, user email, comment, status
let orders = [
    { id: 1, productId: 2, productName: "NoiseBuds X2", productImage: "https://picsum.photos/id/1/100/100", userEmail: "demo@trendhive.com", customerName: "Aarav S.", comment: "Fast shipping, amazing sound!", status: "Delivered", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, productId: 1, productName: "Urban Explorer Jacket", productImage: "https://picsum.photos/id/20/100/100", userEmail: "demo@trendhive.com", customerName: "Ishita R.", comment: "Perfect fit and warm.", status: "Delivered", createdAt: new Date(Date.now() - 2*3600000).toISOString() },
    { id: 3, productId: 3, productName: "Retro Leather Sneakers", productImage: "https://picsum.photos/id/2/100/100", userEmail: "demo@trendhive.com", customerName: "Rohan K.", comment: "Very comfortable!", status: "Shipped", createdAt: new Date(Date.now() - 5*3600000).toISOString() }
];
let nextOrderId = 4;

// ---------- API ROUTES ----------

// Products CRUD
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    product ? res.json(product) : res.status(404).json({ error: "Not found" });
});
app.post('/api/products', (req, res) => {
    const { name, price, category, image, description, rating } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Name & price required" });
    const newProduct = {
        id: nextProductId++,
        name,
        price: parseFloat(price),
        category: category || "general",
        image: image || "https://picsum.photos/id/20/300/200",
        description: description || "",
        rating: rating ? parseFloat(rating) : 4.0
    };
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

// User signup/login (in-memory)
app.post('/api/signup', (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "User already exists" });
    const newUser = { id: nextUserId++, email, password, name: name || email.split('@')[0] };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
});

// Orders (deliveries)
app.get('/api/orders', (req, res) => {
    // return all orders sorted recent first
    res.json(orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/orders', (req, res) => {
    const { productId, productName, productImage, userEmail, customerName, comment } = req.body;
    if (!productId || !userEmail) return res.status(400).json({ error: "Missing fields" });
    const newOrder = {
        id: nextOrderId++,
        productId,
        productName,
        productImage,
        userEmail,
        customerName: customerName || userEmail.split('@')[0],
        comment: comment || "No comment",
        status: "Pending",
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Update order status (for admin delivery management)
app.put('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.status = req.body.status || order.status;
    res.json(order);
});

app.listen(PORT, () => console.log(`🔥 Server running at http://localhost:${PORT}`));