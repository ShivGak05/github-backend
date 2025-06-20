const AWS = require("aws-sdk");
require("dotenv").config(); 

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();
const S3_BUCKET = "shivangisbucketpikachu";

module.exports = { s3, S3_BUCKET };