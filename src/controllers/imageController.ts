import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Image } from '../models/Image';
import { uploadToS3 } from '../services/s3Service';
import { triggerImageProcessing } from '../services/imageProcessingService';

const imageRepository = AppDataSource.getRepository(Image);

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log("passed here")
    const file = req.file;
    const s3Location = await uploadToS3(file);
    console.log("s3")
    const image = imageRepository.create({
      url: s3Location,
      filename: file.originalname,
    });

    await imageRepository.save(image);

    // Trigger image processing
    triggerImageProcessing(image.id).catch(error => 
      console.error(`Failed to trigger processing for image ${image.id}:`, error)
    );

    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const image = await imageRepository.findOne({ 
      where: { id: parseInt(id) },
      relations: ['comments'] 
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    next(error);
  }
};


export const getAllImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [images, total] = await imageRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['comments']
    });

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found' });
    }

    const totalPages = Math.ceil(total / limit);

    res.json({
      images,
      currentPage: page,
      totalPages,
      totalImages: total
    });
  } catch (error) {
    next(error);
  }
};
