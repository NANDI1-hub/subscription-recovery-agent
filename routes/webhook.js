const express = require('express');
const router = express.Router();
const { classifyEvent } = require('../controllers/classifier');
const { decideAction } = require('../controllers/decision');
const Transaction = require('../models/Transaction');
const { sendRecoveryEmail } = require('../utils/mailer');

router.post('/razorpay', async (req, res) => {
  const event = req.body.event;
  const payload = req.body.payload;

  console.log('--- Webhook received:', event, '---');

  const classification = classifyEvent(event);
  const decision = decideAction(classification);

  console.log('Classification:', classification);
  console.log('Decision:', decision);

  const customerEmail =
    payload?.payment?.entity?.email ||
    payload?.subscription?.entity?.notify_info?.notify_email ||
    null;

  const errorDetails = {
    code: payload?.payment?.entity?.error_code || null,
    description: payload?.payment?.entity?.error_description || null,
    reason: payload?.payment?.entity?.error_reason || null,
    source: payload?.payment?.entity?.error_source || null,
  };
  console.log('Error Details:', errorDetails);

  if (errorDetails.errorSource) {
   classification.reason += ` (confirmed source: ${errorDetails.errorSource})`;
  }

  res.status(200).send('OK');

  try {
    await Transaction.create({
      event,
      bucket: classification.bucket,
      reason: classification.reason,
      errorCode: errorDetails.code,
      errorDescription: errorDetails.description,
      errorReason: errorDetails.reason,
      errorSource: errorDetails.source,
      action: decision.action,
      message: decision.message,
      subscriptionId: payload?.subscription?.entity?.id || null,
      customerEmail,
      amount: payload?.subscription?.entity?.amount || payload?.payment?.entity?.amount || null,
    });
    console.log('Saved to MongoDB');
  } catch (err) {
    console.error('Failed to save transaction:', err.message);
  }

    if (decision.action !== 'none' && customerEmail) {
      const specificReason = errorDetails.errorDescription
        ? `${errorDetails.errorDescription} `
        : '';
      const emailBody = `${specificReason}${decision.message}`;
      await sendRecoveryEmail(customerEmail, decision.subject, emailBody);
    }
});

module.exports = router;