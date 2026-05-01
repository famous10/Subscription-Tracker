var dotenv = require('dotenv');

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`,
});

var { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_KEY, QSTASH_TOKEN, QSTASH_URL, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY, SERVER_URL, EMAIL_PASSWORD, EMAIL_USER } = process.env;

module.exports = {
  PORT: PORT || 5500,
  NODE_ENV: NODE_ENV || 'development',
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN: JWT_EXPIRES_IN || '1d',
  ARCJET_KEY,
  QSTASH_TOKEN,
  QSTASH_URL,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
  SERVER_URL: SERVER_URL || 'http://localhost:5500',
  EMAIL_USER,
  EMAIL_PASSWORD,
};
