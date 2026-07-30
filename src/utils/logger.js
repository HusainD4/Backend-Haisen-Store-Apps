const config = require('../config/env');

class Logger {
    static info(message, data = '') { console.log(`[INFO] ${message}`, data); }
    static debug(message, data = '') {
        if (config.isDebug) console.log(`[DEBUG] ${message}`, data);
    }
    static error(message, error) { console.error(`[ERROR] ${message}`, error); }
}

module.exports = Logger;