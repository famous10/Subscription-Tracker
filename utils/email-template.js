var dayjs = require('dayjs');

// ─── Urgency Config Per Reminder Day ─────────────────────────────────────────
var getUrgencyConfig = (daysBefore) => {
  switch (daysBefore) {
    case 7:
      return { color: '#4F46E5', label: '7 Days', message: 'Your subscription renews in a week. You have plenty of time to review your plan.' };
    case 5:
      return { color: '#0EA5E9', label: '5 Days', message: 'Just a heads-up — your subscription renews in 5 days.' };
    case 3:
      return { color: '#F59E0B', label: '3 Days', message: 'Your subscription renews in 3 days. Please ensure your payment method is ready.' };
    case 1:
      return { color: '#EF4444', label: 'Tomorrow!', message: 'Your subscription renews TOMORROW. Make sure your payment details are up to date immediately.' };
    default:
      return { color: '#4F46E5', label: `${daysBefore} Days`, message: `Your subscription renews in ${daysBefore} days.` };
  }
};

// ─── Reminder Email Template ──────────────────────────────────────────────────
var generateReminderEmail = ({ userName, subscriptionName, renewalDate, planName, price, currency, daysBefore }) => {
  var formattedDate = dayjs(renewalDate).format('MMMM D, YYYY');
  var formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  var { color, label, message } = getUrgencyConfig(daysBefore);

  return {
    subject: `⏰ ${daysBefore === 1 ? 'Last Day!' : `${daysBefore} Days Left`} — Your ${subscriptionName} subscription renews on ${formattedDate}`,

    text: `
Hi ${userName},

${message}

Renewal Details:
- Subscription: ${subscriptionName}
- Plan: ${planName}
- Amount: ${formattedPrice}
- Renewal Date: ${formattedDate}

Please make sure your payment method is up to date to avoid any interruptions.

Thank you,
Subscription Tracker Team
    `.trim(),

    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .header { background-color: ${color}; padding: 24px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
      .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
      .body { padding: 32px; color: #333333; }
      .body p { font-size: 15px; line-height: 1.6; }
      .details { background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin: 24px 0; }
      .details table { width: 100%; border-collapse: collapse; }
      .details td { padding: 8px 0; font-size: 14px; color: #555555; border-bottom: 1px solid #eeeeee; }
      .details tr:last-child td { border-bottom: none; }
      .details td:first-child { font-weight: bold; color: #333333; width: 40%; }
      .badge { display: inline-block; background-color: ${color}; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; }
      .cta { text-align: center; margin: 24px 0; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f4f4; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Subscription Renewal Reminder</h1>
        <p>Renewing in <strong>${label}</strong> — ${formattedDate}</p>
      </div>
      <div class="body">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>${message}</p>
        <div class="details">
          <table>
            <tr>
              <td>Subscription</td>
              <td>${subscriptionName}</td>
            </tr>
            <tr>
              <td>Plan</td>
              <td>${planName}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>${formattedPrice}</td>
            </tr>
            <tr>
              <td>Renewal Date</td>
              <td>${formattedDate}</td>
            </tr>
            <tr>
              <td>Days Remaining</td>
              <td><span class="badge">${label}</span></td>
            </tr>
          </table>
        </div>
        <p>If you wish to cancel or update your subscription, please do so before the renewal date.</p>
        <p>Thank you,<br/><strong>Subscription Tracker Team</strong></p>
      </div>
      <div class="footer">
        &copy; ${dayjs().year()} Subscription Tracker. All rights reserved.<br/>
        You are receiving this email because you have an active subscription.
      </div>
    </div>
  </body>
</html>
    `.trim(),
  };
};

module.exports = { generateReminderEmail };
