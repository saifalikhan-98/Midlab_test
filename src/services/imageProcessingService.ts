import sharp from 'sharp';
import { AppDataSource } from '../config/database';
import { Image } from '../models/Image';
import { uploadToS3 } from './s3Service';
import { sendNotificationEmail } from './emailService';

const imageRepository = AppDataSource.getRepository(Image);

export const processImage = async (imageId: number): Promise<void> => {
  try {
    const image = await imageRepository.findOne({ where: { id: imageId } });
    if (!image) {
      throw new Error('Image not found');
    }

    // Download the image
    const response = await fetch(image.url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the image
    const processedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload the processed image
    const processedImageUrl = await uploadToS3({
      buffer: processedBuffer,
      originalname: `processed-${image.filename}`,
      mimetype: 'image/jpeg',
    } as Express.Multer.File);

    // Update the image record
    image.processedUrl = processedImageUrl;
    console.log("process Url", processedImageUrl)
    await imageRepository.save(image);

    // Send notification
    await sendNotificationEmail(imageId, processedImageUrl);

  } catch (error) {
    console.error('Image processing failed:', error);
    throw error;
  }
};

export const triggerImageProcessing = async (imageId: number): Promise<void> => {
  // This function could be called by a queue worker or directly after image upload
  try {
    await processImage(imageId);
    console.log(`Image ${imageId} processed successfully`);
  } catch (error) {
    console.error(`Failed to process image ${imageId}:`, error);
    // Here you might want to implement some retry logic or error reporting
  }
};