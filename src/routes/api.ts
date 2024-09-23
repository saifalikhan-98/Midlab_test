import express from 'express';
import { uploadImage, getImage, getAllImages } from '../controllers/imageController';
import { addComment } from '../controllers/commentController';
import multer from 'multer';

const router = express.Router();
// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
  });

router.get('/images', getAllImages);
router.post('/images', upload.single('image'), uploadImage);
router.get('/images/:id', getImage);
router.post('/images/:id/comments', addComment);

export default router; 