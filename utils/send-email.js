var { sendEmail } = require('../config/nodemailer');
var { generateReminderEmail } = require('./email-template');

// ─── Send Reminder Email ──────────────────────────────────────────────────────
var sendReminderEmail = async ({ to, userName, subscriptionName, renewalDate, planName, price, currency, daysBefore }) => {
  var { subject, text, html } = generateReminderEmail({
    userName,
    subscriptionName,
    renewalDate,
    planName,
    price,
    currency,
    daysBefore,
  });

  return await sendEmail({ to, subject, text, html });
};

module.exports = { sendReminderEmail };
