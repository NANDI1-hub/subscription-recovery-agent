const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const webhookRoutes = require('./routes/webhook');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(express.json());

connectDB();

app.use('/webhook', webhookRoutes);
app.use('/api', dashboardRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000, () => console.log('Server running'));