const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  event: String,
  bucket: String,
  reason: String,
  action: String,
  message: String,
  subscriptionId: String,
  customerEmail: String,
  amount: Number,
  recovered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);