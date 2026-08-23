const express = require ('express');
const app = express();
app.use(express.json());

app.post('/webhook/razorpay', (req, res) => {
    console.log('webhook receiced:', JSON.stringify(req.body, null, 2));
    res.status(200).send('OK');
});

app.listen(3000, ()=> console.log('Server running on port 3000'));

    