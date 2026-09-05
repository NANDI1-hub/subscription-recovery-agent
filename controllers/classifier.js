function classifyEvent(event){
    switch(event){
        case 'subscription.charged':
            return {bucket: 'success', reason: 'payment succeeded, no action needed'};

        case 'payment.failed':
            return {bucket: 'retry-later', reason: 'a payment attempt failed — customer should check their payment method' };    
        
        case 'subscription.pending':
            return {bucket: 'retry-later', reason: 'temporary issue (bank/timeout) — Razorpay will auto-retry' };

        case 'subscription.cancelled':
            return  {bucket: 'escalate', reason: 'mandate cancelled/revoked — needs re-authorization, do not auto-retry' }; 
            
        case 'subscription.halted':
            return  {bucket: 'needs-new-method', reason: 'repeated failures — customer must update payment method' };    

        default:
            return { bucket: 'unknown', reason: `unrecognized event: ${event}` };
    }
}


module.exports = { classifyEvent };