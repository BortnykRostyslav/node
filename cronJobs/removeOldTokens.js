const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc')
dayJs.extend(utc);

const authService = require('../api/auth/auth.service');

module.exports = async () => {
    console.log('Remove old token start', new Date().toISOString());
    const twoWeeksBeforeNow = dayJs().utc().subtract(14, 'days');

    console.log(twoWeeksBeforeNow.format());

    const deletedResult = await authService.deleteManyByParams({createdAt: {$lte: twoWeeksBeforeNow}});

    console.log(deletedResult);

    console.log('Remove old token end', new Date().toISOString());

};