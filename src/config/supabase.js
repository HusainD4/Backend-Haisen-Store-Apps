const { createClient } = require('@supabase/supabase-js');
const config = require('./env');
const Logger = require('../utils/logger');

class Database {
    constructor() {
        if (!Database.instance) {
            this.client = createClient(config.supabaseUrl, config.supabaseKey);
            Logger.info('Supabase client initialized.');
            Database.instance = this;
        }
        return Database.instance;
    }
}

module.exports = new Database().client;