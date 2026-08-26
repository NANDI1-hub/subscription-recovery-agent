function decideAction(classification) {
  switch (classification.bucket) {
    case 'retry-later':
      return { action: 'send_reminder', message: 'We are retrying your payment automatically. No action needed right now.' };
    case 'needs-new-method':
      return { action: 'request_update', message: 'Your subscription payment failed repeatedly. Please update your payment method to keep your subscription active.' };
    case 'escalate':
      return { action: 'escalate_human', message: 'Your subscription mandate was cancelled. Please re-authorize to continue, or our team will reach out.' };
    default:
      return { action: 'none', message: null };


  }
}



module.exports = { decideAction };