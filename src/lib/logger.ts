import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: [
    'req.headers.authorization',
    'req.headers["x-api-key"]',
    '*.email',
    '*.password',
    'body.user_id',
    'body.password',
    'body.token',
  ],
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})