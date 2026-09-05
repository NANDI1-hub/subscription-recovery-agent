function getFaultMessage(source) {
  switch (source) {
    case 'customer':
      return "This appears to be an issue on your end — for example, insufficient funds or an expired card. Please check your payment method.";
    case 'bank':
      return "Your bank declined this payment. Please contact your bank for more details, or try a different payment method.";
    case 'business':
      return "Your bank or card doesn't support this type of transaction (for example, international payments may be restricted).";
    case 'gateway':
    case 'internal':
      return "This was a temporary issue on our payment processor's end, not related to your account. No action is needed from you right now.";
    default:
      return null;
  }
}

function buildEmailBody(specificReason, coreMessage, faultSource) {
  const faultMessage = getFaultMessage(faultSource);
  return `Hi,

${faultMessage ? faultMessage + '\n\n' : ''}${coreMessage}

Thanks,
The Subscription Team`;
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