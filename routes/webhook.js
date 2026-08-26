const express = require('express');
const router = express.Router();
const { classifyEvent } = require('../controllers/classifier');
const { decideAction } = require('../controllers/decision');

router.post('/razorpay', (req, res) => {
  const event = req.body.event;
  console.log('--- Webhook received:', event, '---');

  const classification = classifyEvent(event);
  const decision = decideAction(classification);

  console.log('Classification:', classification);
  console.log('Decision:', decision);

  res.status(200).send('OK');
});

module.exports = router;