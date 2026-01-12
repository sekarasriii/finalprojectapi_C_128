const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS untuk frontend
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));
// Import routes
const authRoutes = require('./routes/auth.routes');
const apikeyRoutes = require('./routes/apikey.routes');
const serviceRoutes = require('./routes/service.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');

// Test database connection
require('./config/database');
