const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    return JSON.stringify(logEntry);
  }

  writeToFile(level, message) {
    const filename = path.join(logsDir, `${level.toLowerCase()}.log`);
    const logEntry = this.formatMessage(level, message);
    
    fs.appendFile(filename, logEntry + '\n', (err) => {
      if (err) console.error('Failed to write to log file:', err);
    });
  }

  shouldLog(level) {
    return logLevels[level] <= logLevels[this.logLevel];
  }

  error(message, meta = {}) {
    if (this.shouldLog('ERROR')) {
      console.error(`[ERROR] ${message}`, meta);
      this.writeToFile('ERROR', message);
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog('WARN')) {
      console.warn(`[WARN] ${message}`, meta);
      this.writeToFile('WARN', message);
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog('INFO')) {
      console.info(`[INFO] ${message}`, meta);
      this.writeToFile('INFO', message);
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog('DEBUG')) {
      console.debug(`[DEBUG] ${message}`, meta);
      this.writeToFile('DEBUG', message);
    }
  }

  // Security-specific logging
  security(event, details = {}) {
    const securityLog = {
      event,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    console.warn(`[SECURITY] ${event}`, details);
    
    const filename = path.join(logsDir, 'security.log');
    fs.appendFile(filename, JSON.stringify(securityLog) + '\n', (err) => {
      if (err) console.error('Failed to write to security log:', err);
    });
  }
}

module.exports = new Logger();