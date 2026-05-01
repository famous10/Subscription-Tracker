var nodemailer = require('nodemailer');
var { EMAIL_USER, EMAIL_PASSWORD } = require('./env');

// ─── Transporter ──────────────────────────────────────────────────────────────
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// ─── Send Email ───────────────────────────────────────────────────────────────
var sendEmail = async ({ to, subject, text, html }) => {
  var mailOptions = {
    from: `Subscription Tracker <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    var info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = { transporter, sendEmail };
