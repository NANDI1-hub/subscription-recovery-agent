const express = require('express');
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(express.json());
app.use('/webhook', webhookRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server running LOVE'));