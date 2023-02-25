const path = require('node:path');
const uuid = require('uuid').v4;
const AWS_S3 = require('aws-sdk/clients/s3');
const { S3_REGION, AWS_SECRET_KEY, AWS_ACCESS_KEY, S3_BUCKET } = require('../configs/variables');

const S3 = new AWS_S3({
    region: S3_REGION,
    secretAccessKey: AWS_SECRET_KEY,
    accessKeyId: AWS_ACCESS_KEY,
    apiVersion: 'latest',
    signatureVersion: 'v4'
});

async function uploadFileToS3(file, itemId, itemType){
    const Key = fileNameBuilder(file, itemId, itemType);

    await S3
        .upload({
            Bucket: S3_BUCKET,
            Body: file.data,
            Key,
            ContentType: file.mimetype
        }).promise();         // is always required

    return Key;
}

function getFileFromS3(Key){
    return  S3.getSignedUrl('getObject', { Key, Bucket: S3_BUCKET, Expires: 5 * 60 });
}

function deleteImageFromS3(Key){
    return S3.deleteObject({ Key, Bucket: S3_BUCKET }).promise();
}

function fileNameBuilder(file, itemId, itemType){
    const extension = path.extname(file.name); // .jpg

    return `${itemType}/${itemId}/${uuid()}${extension}`;
}



module.exports = {
    uploadFileToS3,
    getFileFromS3,
    deleteImageFromS3
}