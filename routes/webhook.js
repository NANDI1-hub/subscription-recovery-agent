const express = require('express');
const router = express.Router();
const { classifyEvent } = require('../controllers/classifier');
const { decideAction } = require('../controllers/decision');
const Transaction = require('../models/Transaction');

router.post('/razorpay', async (req, res) => {
  const event = req.body.event;
  const payload = req.body.payload;

  console.log('--- Webhook received:', event, '---');

  const classification = classifyEvent(event);
  const decision = decideAction(classification);

  console.log('Classification:', classification);
  console.log('Decision:', decision);

  try {
    await Transaction.create({
      event,
      bucket: classification.bucket,
      reason: classification.reason,
      action: decision.action,
      message: decision.message,
      subscriptionId: payload?.subscription?.entity?.id || null,
      amount: payload?.subscription?.entity?.amount || null,
    });
    console.log('Saved to MongoDB');
  } catch (err) {
    console.error('Failed to save transaction:', err.message);
  }

  res.status(200).send('OK');
});

module.exports = router;