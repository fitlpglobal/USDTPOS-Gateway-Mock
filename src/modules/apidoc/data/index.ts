import type { ApiEndpoint } from '../types';

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'configure',
    name: 'Configure (Step 1)',
    method: 'POST',
    path: '/api/configure.js',
    description: 'Merchant onboarding for USDT gateway - creates HD wallet for the merchant',
    requestSchema: { 
      merchantId: 'string (required)', 
      authMethod: 'string (required)' 
    },
    responseSchema: {
      walletId: 'string',
      seedPhrase: 'string (12-word mnemonic)',
      status: 'configured',
      createdAt: 'ISO8601 timestamp'
    },
    color: 'bg-blue-500'
  },
  {
    id: 'pay',
    name: 'Create Payment Invoice',
    method: 'POST',
    path: '/api/pay.js',
    description: 'Generate a USDT payment invoice on Polygon Amoy with QR code for deposit',
    requestSchema: {
      merchantId: 'string (required)',
      amount: 'number (required)',
      currency: 'string (required, "USDT")'
    },
    responseSchema: {
      invoiceId: 'string',
      merchantId: 'string',
      amount: 'number',
      currency: 'string',
      depositAddress: 'string (derived from merchant HD wallet)',
      qrCodeUrl: 'string (base64 QR code)',
      status: 'pending',
      expiresAt: 'ISO8601 timestamp',
      callbackUrl: 'string (merchant webhook endpoint)'
    },
    color: 'bg-green-500'
  },
  {
    id: 'cancel',
    name: 'Cancel Payment',
    method: 'POST',
    path: '/api/cancel.js',
    description: 'Cancel a pending USDT payment invoice and update status',
    requestSchema: { invoiceId: 'string (required)' },
    responseSchema: {
      invoiceId: 'string',
      status: 'cancelled',
      cancelledAt: 'ISO8601 timestamp',
      message: 'string'
    },
    color: 'bg-orange-500'
  },
  {
    id: 'refund',
    name: 'Create Refund Invoice',
    method: 'POST',
    path: '/api/refund.js',
    description: 'Issue a refund invoice for a completed USDT payment with QR code for processing',
    requestSchema: {
      invoiceId: 'string (required)',
      amount: 'number (optional - defaults to full amount)',
      reason: 'string (optional)'
    },
    responseSchema: {
      originalInvoiceId: 'string',
      refundInvoiceId: 'string',
      refundAmount: 'number',
      merchantRefundAddress: 'string (HD wallet address merchant controls)',
      customerRefundAddress: 'string (original payer address)',
      refundQr: 'string (base64 QR code)',
      refundStatus: 'pending',
      expiresAt: 'ISO8601 timestamp',
      reason: 'string'
    },
    color: 'bg-red-500'
  },
  {
    id: 'callback',
    name: 'Webhook Callback',
    method: 'POST',
    path: '/api/webhook.js',
    description: 'USDT gateway -> Merchant system webhook for payment/refund status updates\n\n⚠️ MOCK PREVIEW ONLY: In production, the gateway calls the merchant\'s webhook URL when events happen (invoice paid, refund confirmed, etc). This /callback endpoint in the mock API is only here to simulate the payload for testing/demo purposes. Merchants do not call this endpoint — they should implement their own webhook receiver.',
    requestSchema: {
      event: "'payment_confirmed'|'payment_expired'|'refund_confirmed'",
      invoiceId: 'string',
      amount: 'number',
      currency: "'USDT'",
      network: "'Polygon-Amoy'",
      address: 'string (deposit or refund address)',
      txId: 'string (blockchain transaction hash)',
      status: "'confirmed'|'expired'|'refunded'",
      timestamp: 'ISO8601 timestamp'
    },
    responseSchema: { 
      received: 'boolean', 
      message: 'string (⚠️ This is mock-only for demo)' 
    },
    color: 'bg-purple-500'
  }
];

export const exampleRequests: Record<string, any> = {
  configure: { merchantId: 'merchant_12345', authMethod: 'api_key' },
  pay: { merchantId: 'merchant_12345', amount: 150.5, currency: 'USDT' },
  cancel: { invoiceId: 'inv_example123' },
  refund: { invoiceId: 'inv_example123', amount: 95.5, reason: 'Customer requested refund' },
  callback: {
    event: 'payment_confirmed',
    invoiceId: 'inv_example123',
    amount: 150.5,
    currency: 'USDT',
    network: 'Polygon-Amoy',
    address: '0x742aA8e7C2F1c2E5B8c8F2C5B4e6A7C3B2D1E9F8',
    txId: '0xabc123def456789012345678901234567890abcdef123456789012345678901234',
    status: 'confirmed',
    timestamp: new Date().toISOString()
  }
};

export const generateMockResponse = (endpointId: string, requestBody: string) => {
  const mockData: any = {};
  switch (endpointId) {
    case 'configure':
      mockData.walletId = 'wallet_' + Math.random().toString(36).substr(2, 9);
      mockData.seedPhrase = 'abandon ability able about above absent absorb abstract absurd abuse access accident';
      mockData.status = 'configured';
      mockData.createdAt = new Date().toISOString();
      break;
    case 'pay': {
      const parsed = JSON.parse(requestBody || '{}');
      const merchantId = parsed.merchantId || 'merchant_12345';
      const amount = parsed.amount || 100;
      const currency = parsed.currency || 'USDT';
      
      mockData.invoiceId = 'inv_' + Math.random().toString(36).substr(2, 9);
      mockData.merchantId = merchantId;
      mockData.amount = amount;
      mockData.currency = currency;
      // Generate mock Polygon Amoy address derived from merchant HD wallet
      mockData.depositAddress = '0x' + Math.random().toString(16).substr(2, 40);
      mockData.qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      mockData.status = 'pending';
      mockData.expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      mockData.callbackUrl = `https://merchant.example.com/webhook/${merchantId}`;
      break;
    }
    case 'cancel': {
      const parsed = JSON.parse(requestBody || '{}');
      const invoiceId = parsed.invoiceId || 'inv_example123';
      
      mockData.invoiceId = invoiceId;
      mockData.status = 'cancelled';
      mockData.cancelledAt = new Date().toISOString();
      mockData.message = 'Invoice cancelled successfully';
      break;
    }
    case 'refund': {
      const parsed = JSON.parse(requestBody || '{}');
      const originalInvoiceId = parsed.invoiceId || 'inv_example123';
      const refundAmount = parsed.amount ?? 95.5;
      const reason = parsed.reason || 'unspecified';
      
      mockData.originalInvoiceId = originalInvoiceId;
      mockData.refundInvoiceId = 'refund_' + Math.random().toString(36).substr(2, 9);
      mockData.refundAmount = refundAmount;
      // Generate mock Polygon Amoy addresses
      mockData.merchantRefundAddress = '0x' + Math.random().toString(16).substr(2, 40);
      mockData.customerRefundAddress = '0x' + Math.random().toString(16).substr(2, 40);
      mockData.refundQr = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      mockData.refundStatus = 'pending';
      mockData.expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      mockData.reason = reason;
      break;
    }
    case 'callback': {
      const parsed = JSON.parse(requestBody || '{}');
      const event = parsed.event || 'payment_confirmed';
      
      mockData.received = true;
      mockData.message = `Event ${event} processed`;
      break;
    }
  }

  return mockData;
};
