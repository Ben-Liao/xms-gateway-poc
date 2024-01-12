const { createLogger, format, transports } = require('winston');
const jsonStr = require('fast-safe-stringify');

const { combine } = format;

const sensitiveKeys = new Set(['password', 'user.password']);
const isObject = (val) => val && typeof val === 'object';

// Utility function to obscure sensitive data
const obscureSensitiveData = (obj, basePath = '') => Object.keys(obj).reduce((acc, key) => {
  const newPath = basePath ? `${basePath}.${key}` : key;

  if (sensitiveKeys.has(newPath)) {
    acc[key] = '[HIDDEN]';
  } else if (isObject(obj[key])) {
    acc[key] = obscureSensitiveData(obj[key], newPath);
  } else {
    acc[key] = obj[key];
  }
  return acc;
}, {});

const obscureData = (data) => {
  const clonedData = JSON.parse(JSON.stringify(data));
  obscureSensitiveData(clonedData);
  return clonedData;
};

const customFormat = format.printf((data) => {
  const { level, message, timestamp } = data;
  const args = data[Symbol.for('splat')];
  let strArgs = '';

  if (args) {
    const obscuredArgs = args.map((arg) => obscureData(arg));
    strArgs = obscuredArgs.map(jsonStr).join(' ');
  }

  return `[${timestamp}] ${level}: ${message} ${strArgs}`;
});

const logger = createLogger({
  level: (process.env.RUN_ENV === 'local' ? 'debug' : 'info'),
  format: combine(
    format.timestamp(),
    customFormat,
  ),
  transports: [new transports.Console()],
});

logger.setLevels({
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
});

module.exports = logger;
