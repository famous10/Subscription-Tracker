var { Client } = require('@upstash/qstash');
var { QSTASH_TOKEN } = require('./env');

// ─── QStash Client ────────────────────────────────────────────────────────────
var qstashClient = new Client({
  token: QSTASH_TOKEN,
});

module.exports = { qstashClient };
