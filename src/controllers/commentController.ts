import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Comment } from '../models/Comment';
import { Image } from '../models/Image';

const commentRepository = AppDataSource.getRepository(Comment);
const imageRepository = AppDataSource.getRepository(Image);

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const image = await imageRepository.findOne({ where: { id: parseInt(id) } });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const commentObj = commentRepository.create({
      comment,
      image,
    });

    await commentRepository.save(commentObj);

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};