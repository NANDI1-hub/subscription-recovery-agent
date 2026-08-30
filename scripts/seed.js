const { classifyEvent } = require('../controllers/classifier');
const { decideAction } = require('../controllers/decision');
const Transaction = require('../models/Transaction');

const EVENTS = ['subscription.pending', 'subscription.halted', 'subscription.cancelled'];
const RECOVERY_ODDS = { 'retry-later': 0.7, 'needs-new-method': 0.4, 'escalate': 0.15 };

function randomAmount() {
  return Math.floor(Math.random() * (2000 - 200) + 200) * 100;
}

async function seedTransactions(count = 60) {
  const docs = [];
  for (let i = 0; i < count; i++) {
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const classification = classifyEvent(event);
    const decision = decideAction(classification);
    const odds = RECOVERY_ODDS[classification.bucket] ?? 0;
    const recovered = Math.random() < odds;

    docs.push({
      event,
      bucket: classification.bucket,
      reason: classification.reason,
      action: decision.action,
      message: decision.message,
      subscriptionId: `sub_synthetic_${i}`,
      customerEmail: `testcustomer${i}@example.com`,
      amount: randomAmount(),
      recovered,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  await Transaction.insertMany(docs);
  return docs.length;
}

module.exports = seedTransactions;