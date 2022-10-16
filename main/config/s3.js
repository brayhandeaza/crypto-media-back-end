require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKey,
    secretKey
})


const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

module.exports = {
    uploadFile
}