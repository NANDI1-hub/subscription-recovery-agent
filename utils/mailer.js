const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendRecoveryEmail(toEmail, subject, message) {
  if (!toEmail) {
    console.log('No customer email found — skipping email send.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Subscription Recovery <onboarding@resend.dev>',
      to: toEmail,
      subject: subject,
      html: `<p>Hi,</p><p>${message}</p><p>Thanks,<br>The Subscription Team</p>`,
    });
    console.log('Recovery email sent to:', toEmail);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

module.exports = { sendRecoveryEmail };