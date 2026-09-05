function buildEmailBody(specificReason, coreMessage) {
  return `Hi,

${specificReason ? specificReason + '\n\n' : ''}${coreMessage}

If you have any questions, feel free to reply to this email — we're happy to help.

THANKS`;
}

function decideAction(classification) {
  switch (classification.bucket) {
    case 'retry-later':
      return {
        action: 'send_reminder',
        subject: 'A quick note about your recent payment',
        message: "Your subscription payment couldn't be completed this time. Our system will automatically attempt the charge again shortly — there's nothing you need to do right now.",
      };
    case 'needs-new-method':
      return {
        action: 'request_update',
        subject: 'Action needed: update your payment method',
        message: "We've been unable to process your subscription payment after multiple attempts. To avoid any interruption to your subscription, please update your payment method at your earliest convenience.",
      };
    case 'escalate':
      return {
        action: 'escalate_human',
        subject: 'Your subscription needs re-authorization',
        message: "Your payment authorization was cancelled, so we're unable to continue billing your subscription automatically. Please re-authorize your payment method to keep your subscription active.",
      };
    default:
      return { action: 'none', subject: null, message: null };
  }
}

module.exports = { decideAction, buildEmailBody };