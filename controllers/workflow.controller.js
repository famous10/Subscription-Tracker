var { serve } = require('@upstash/workflow');
var dayjs = require('dayjs');

var Subscription = require('../models/subscription.model');
var { SERVER_URL } = require('../config/env');
var { sendReminderEmail } = require('../utils/send-email');

// ─── Reminder Days Before Renewal ─────────────────────────────────────────────
var REMINDER_DAYS = [7, 5, 3, 1];

// ─── Send Reminder Workflow ───────────────────────────────────────────────────
var sendReminders = serve(async (context) => {
  var { subscriptionId } = context.requestPayload;

  // ─── Step 1: Fetch Subscription ───────────────────────────────────────────
  var subscription = await context.run('get-subscription', async () => {
    var sub = await Subscription.findById(subscriptionId).populate('user', 'name email');
    if (!sub) throw new Error(`Subscription ${subscriptionId} not found`);

    // Return plain object so it can be serialized by QStash
    return {
      _id: sub._id.toString(),
      name: sub.name,
      price: sub.price,
      currency: sub.currency,
      frequency: sub.frequency,
      category: sub.category,
      status: sub.status,
      renewalDate: sub.renewalDate,
      user: {
        _id: sub.user._id.toString(),
        name: sub.user.name,
        email: sub.user.email,
      },
    };
  });

  // ─── Step 2: Stop if not active ───────────────────────────────────────────
  if (subscription.status !== 'active') {
    console.log(`Subscription ${subscriptionId} is not active. Stopping workflow.`);
    return;
  }

  var { user, renewalDate, name, price, currency } = subscription;

  // ─── Step 3: Loop Through Reminder Days ───────────────────────────────────
  for (var daysBefore of REMINDER_DAYS) {
    var reminderDate = dayjs(renewalDate).subtract(daysBefore, 'day').toDate();

    // Skip if reminder date has already passed
    if (dayjs(reminderDate).isBefore(dayjs())) {
      console.log(`Skipping ${daysBefore}-day reminder — date has passed.`);
      continue;
    }

    // ─── Step 4: Wait Until Reminder Date ─────────────────────────────────
    await context.sleepUntil(`reminder-${daysBefore}-days`, reminderDate);

    // ─── Step 5: Send Reminder Email ──────────────────────────────────────
    await context.run(`send-reminder-${daysBefore}-days`, async () => {
      await sendReminderEmail({
        to: user.email,
        userName: user.name,
        subscriptionName: name,
        renewalDate,
        planName: name,
        price,
        currency,
        daysBefore,
      });
      console.log(`✅ Sent ${daysBefore}-day reminder to ${user.email} for ${name}`);
    });
  }
}, {
  baseUrl: SERVER_URL,
});

module.exports = { sendReminders };
