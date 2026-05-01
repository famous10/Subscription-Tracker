// ─── Core Modules ────────────────────────────────────────────────────────────
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ─── Config ───────────────────────────────────────────────────────────────────
var { PORT } = require('./config/env');

// ─── Database ─────────────────────────────────────────────────────────────────
var connectToDatabase = require('./database/mongodb');

// ─── Routers ──────────────────────────────────────────────────────────────────
var authRouter = require('./router/auth.router');
var userRouter = require('./router/user.router');
var subscriptionRouter = require('./router/subscription.router');
var workflowRouter = require('./router/workflow.router');

// ─── Middleware ───────────────────────────────────────────────────────────────
var errorMiddleware = require('./middlewares/errors.middleware');
var arcjetMiddleware = require('./middlewares/arcjet.middleware');

// ─── App Setup ────────────────────────────────────────────────────────────────
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Subscription Tracker API</h1>');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectToDatabase();
});

module.exports = app;
