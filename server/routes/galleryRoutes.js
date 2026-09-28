import { Router } from 'express';
import {
  createGalleryImage,
  deleteGalleryImage,
  listGallery,
  updateGalleryImage,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { mongoIdParam } from '../validators/common.js';
import { createGalleryRules, listGalleryRules, updateGalleryRules } from '../validators/galleryValidators.js';

const router = Router();

router
  .route('/')
  .get(validate(listGalleryRules), listGallery)
  .post(protect, uploadImage, validate(createGalleryRules), createGalleryImage);

router
  .route('/:id')
  .put(protect, uploadImage, validate([...mongoIdParam, ...updateGalleryRules]), updateGalleryImage)
  .delete(protect, validate(mongoIdParam), deleteGalleryImage);

export default router;
