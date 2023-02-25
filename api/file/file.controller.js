const { getFileFromS3 } = require('../../services/file.service');

module.exports = {
    getPrivateFile: (req, res, next) => {
        try{
            const fileFromS3 = getFileFromS3(req.query.url);

            res.json(fileFromS3);
        } catch (e) {
            next(e);
        }
    }
};