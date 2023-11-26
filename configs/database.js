const mongoose = require('mongoose');

const logger = require('../utils/logger')(__filename);

async function start() {
    logger.info('Connecting to the database');
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL);
}

module.exports = start;
