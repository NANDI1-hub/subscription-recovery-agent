const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/stats', async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    const recovered = await Transaction.countDocuments({ recovered: true });
    const byBucket = await Transaction.aggregate([
      { $group: { _id: '$bucket', count: { $sum: 1 } } }
    ]);
    const totalAmountAtRisk = await Transaction.aggregate([
      { $match: { recovered: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      total,
      recovered,
      recoveryRate: total ? ((recovered / total) * 100).toFixed(1) : 0,
      byBucket,
      amountAtRisk: totalAmountAtRisk[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;