var { default: arcjet, shield, slidingWindow, detectBot } = require('@arcjet/node');
var { ARCJET_KEY } = require('./env');

var aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    // ─── Shield: Protect against common attacks ───────────────────────────────
    shield({ mode: 'LIVE' }),

    // ─── Rate Limiting: Sliding window ────────────────────────────────────────
    slidingWindow({
      mode: 'LIVE',
      interval: '1m',
      max: 100,
    }),

    // ─── Bot Detection ────────────────────────────────────────────────────────
    detectBot({
      mode: 'LIVE',
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        'CATEGORY:MONITOR',
        'CATEGORY:PREVIEW',
      ],
    }),
  ],
});

module.exports = aj;
