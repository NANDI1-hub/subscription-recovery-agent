const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 lookups instead of IPv6 (fixes ENETUNREACH on some hosts like Render free tier)
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendRecoveryEmail(toEmail, subject, message) {
  if (!toEmail) {
    console.log('No customer email found — skipping email send.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Subscription Recovery" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: message,
    });
    console.log('Recovery email sent to:', toEmail);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

module.exports = { sendRecoveryEmail };