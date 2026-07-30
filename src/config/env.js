require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    isDebug: process.env.DEBUG === 'true',
    apiPrefix: process.env.API_SECRET_PREFIX || 'hx789-v2' 
};