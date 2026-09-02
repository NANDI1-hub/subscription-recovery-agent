**Subscription Recovery Agent**
An automated agent that detects failed subscription payments in real time, classifies the failure, logs it, and notifies the customer — with zero manual intervention.

Live dashboard: https://subscription-recovery-agent.onrender.com/

**The Problem**

When a recurring subscription payment fails, most systems just... stop. The business doesn't know why it failed, the customer isn't told, and revenue quietly leaks away. This agent closes that gap automatically.
**What It Does**

1. Listens for real-time payment events from Razorpay via webhooks.
2. Classifies each failure into a category (retry-later, needs-new-method, escalate) based on the event type.
3. Diagnoses the root cause using Razorpay's error metadata (error code, description, source — e.g. bank decline, gateway timeout, international-transaction block).
4. Acts by automatically emailing the customer with a relevant, category-specific message.
5. Logs every event to a database with full diagnostic detail, visible on a live dashboard.

This is a rule-based automation agent: it perceives an event, reasons about it using deterministic classification logic, and acts autonomously — without a human in the loop. Rule-based (rather than LLM-based) reasoning was chosen deliberately, since predictable, auditable behavior matters more than conversational flexibility when money is involved.

**Architecture**

Razorpay (payment event)
        │
        ▼
  Webhook endpoint (Express)
        │
        ▼
  Classifier  →  bucket (retry-later / needs-new-method / escalate)
        │
        ▼
  Decision engine  →  action + customer-facing message + email subject
        │
        ├──▶ MongoDB (transaction log + diagnostic fields)
        │
        └──▶ Resend API (customer email)
        │
        ▼
  Dashboard (live stats + recent events)

**Tech Stack**
Backend: Node.js, Express
Database: MongoDB (Atlas)
Email: Resend API
Hosting: Render
Payment provider: Razorpay (webhooks + subscriptions)
Frontend: Vanilla HTML/CSS/JS dashboard, served statically

**Project Structure**

├── server.js                 # App entry point
├── config/
│   ├── db.js                 # MongoDB connection
│   └── seedLogic.js           # Synthetic data generator (dev/demo only)
├── controllers/
│   ├── classifier.js         # Event → bucket classification
│   └── decision.js           # Bucket → action, message, email subject
├── models/
│   └── Transaction.js        # Mongoose schema for logged events
├── routes/
│   ├── webhook.js            # Razorpay webhook handler
│   └── dashboard.js          # API endpoints for dashboard stats/data
├── utils/
│   └── mailer.js              # Resend email integration
└── public/
    └── index.html             # Live dashboard UI

**How It Works(Step by Step)**
1. Razorpay sends a webhook POST to /webhook/razorpay whenever a payment event occurs (e.g. payment.failed, subscription.pending, subscription.cancelled)
2. classifier.js maps the event name to a bucket and extracts a human-readable reason
3. decision.js maps that bucket to a concrete action, a customer-facing message, and an email subject line
4. The server responds to Razorpay immediately (within the required time window) before doing further work, to avoid duplicate retry deliveries
5. The event — including Razorpay's raw diagnostic fields (error_code, error_description, error_reason, error_source) — is saved to MongoDB
6. If the bucket requires action, a recovery email is sent to the customer via Resend
7. The dashboard polls two API endpoints (/api/stats, /api/transactions) every 10 seconds to show live totals and recent activity


** Future Improvements**
1. Add webhook signature verification
2. Support WhatsApp notifications alongside email
3. Add a retry-attempt counter and automatic escalation after N failures
4. Verify a custom sending domain on Resend for production email delivery
