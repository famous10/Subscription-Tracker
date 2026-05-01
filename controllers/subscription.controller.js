var Subscription = require('../models/subscription.model');
var User = require('../models/user.model');
var { qstashClient } = require('../config/upstash');
var { SERVER_URL } = require('../config/env');
var { sendReminderEmail } = require('../utils/send-email');

// ─── Get All Subscriptions ────────────────────────────────────────────────────
var getSubscriptions = async (req, res, next) => {
  try {
    var subscriptions = await Subscription.find().populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Subscriptions fetched successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Subscription By ID ───────────────────────────────────────────────────
var getSubscription = async (req, res, next) => {
  try {
    var subscription = await Subscription.findById(req.params.id).populate('user', 'name email');

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription fetched successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Create Subscription ──────────────────────────────────────────────────────
var createSubscription = async (req, res, next) => {
  try {
    var subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    var user = await User.findById(req.user._id);

    // ─── Send Immediate Confirmation Email ────────────────────────────────────
    try {
      await sendReminderEmail({
        to: user.email,
        userName: user.name,
        subscriptionName: subscription.name,
        renewalDate: subscription.renewalDate,
        planName: subscription.name,
        price: subscription.price,
        currency: subscription.currency,
        daysBefore: 7,
      });
      console.log(`✅ Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Email send failed:', emailError.message);
    }

    // ─── Trigger QStash Workflow (non-blocking) ───────────────────────────────
    try {
      await qstashClient.publishJSON({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: { subscriptionId: subscription._id },
      });
      console.log('✅ QStash workflow triggered');
    } catch (qstashError) {
      console.error('QStash trigger failed (needs public URL):', qstashError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update Subscription ──────────────────────────────────────────────────────
var updateSubscription = async (req, res, next) => {
  try {
    var subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this subscription' });
    }

    var updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Subscription ──────────────────────────────────────────────────────
var deleteSubscription = async (req, res, next) => {
  try {
    var subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this subscription' });
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Subscriptions By User ────────────────────────────────────────────────
var getUserSubscriptions = async (req, res, next) => {
  try {
    var subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User subscriptions fetched successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getUserSubscriptions,
};
