function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Binance Pay Email Sender')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function sendEmail(recipient, amount, currency, payId) {
  try {
    const orderId = generateOrderId();
    const antiPhishingCode = generateAntiPhishingCode();
    const timestamp = formatDateTime(new Date());

    const template = HtmlService.createTemplateFromFile('email_template');
    template.amount = amount;
    template.currency = currency;
    template.payId = payId;
    template.orderId = orderId;
    template.antiPhishingCode = antiPhishingCode;
    template.timestamp = timestamp;

    const htmlBody = template.evaluate().getContent();

    GmailApp.sendEmail(recipient, 'Payment Successful', '', {
      htmlBody: htmlBody,
      name: 'Binance'
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function generateOrderId() {
  // Generate a random 19-digit number
  let orderId = "";
  for (let i = 0; i < 19; i++) {
    orderId += Math.floor(Math.random() * 10);
  }
  return orderId;
}

function generateAntiPhishingCode() {
  // Generate a random 8-character alphanumeric code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function formatDateTime(date) {
  // Format: YYYY-MM-DD HH:mm:ss
  const pad = (n) => n < 10 ? '0' + n : n;
  return date.getUTCFullYear() + '-' +
    pad(date.getUTCMonth() + 1) + '-' +
    pad(date.getUTCDate()) + ' ' +
    pad(date.getUTCHours()) + ':' +
    pad(date.getUTCMinutes()) + ':' +
    pad(date.getUTCSeconds());
}
