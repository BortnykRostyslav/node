const cron = require('node-cron');

const removeOldTokens = require('./removeOldTokens');


cron.schedule('* * * * *', removeOldTokens);


