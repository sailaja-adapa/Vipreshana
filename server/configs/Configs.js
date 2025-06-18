require('dotenv').config();

const Configs = {
    PORT: process.env.PORT,
    DB_URI: process.env.MONGO_CONNECTION_STRING,
    TWILIO_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}

module.exports = Configs;