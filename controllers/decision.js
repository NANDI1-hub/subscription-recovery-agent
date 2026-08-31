function decideAction(classification) {
  switch (classification.bucket) {
    case 'retry-later':
      return {
        action: 'send_reminder',
        subject: 'We\'re retrying your payment',
        message: 'We are retrying your payment automatically. No action needed right now.'
      };
    case 'needs-new-method':
      return {
        action: 'request_update',
        subject: 'Please update your payment method',
        message: 'Your subscription payment failed repeatedly. Please update your payment method to keep your subscription active.'
      };
    case 'escalate':
      return {
        action: 'escalate_human',
        subject: 'Action required: subscription mandate cancelled',
        message: 'Your subscription mandate was cancelled. Please re-authorize to continue, or our team will reach out.'
      };
    default:
      return { action: 'none', subject: null, message: null };
  }
}

module.exports = { decideAction };