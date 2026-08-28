const express = require('express');
const connectDB = require('./config/db');
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(express.json());

connectDB();

app.use('/webhook', webhookRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server running'));