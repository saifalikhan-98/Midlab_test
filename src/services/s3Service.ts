import AWS from 'aws-sdk';
import { config } from '../config/aws';
import { env } from "../config/env";

const s3 = new AWS.S3(config);

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const bucketName = env.AWS_S3_BUCKET_NAME;
  console.log("bucket", bucketName)
  if (!bucketName) {
    throw new Error('AWS S3 bucket name is not defined in environment variables');
  }

  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};