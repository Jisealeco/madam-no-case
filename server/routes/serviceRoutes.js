import { Router } from 'express';
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from '../controllers/serviceController.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { mongoIdParam } from '../validators/common.js';
import { createServiceRules, updateServiceRules } from '../validators/serviceValidators.js';

const router = Router();

router
  .route('/')
  .get(optionalAuth, listServices)
  .post(protect, uploadImage, validate(createServiceRules), createService);

router
  .route('/:id')
  .get(optionalAuth, getService)
  .put(protect, uploadImage, validate([...mongoIdParam, ...updateServiceRules]), updateService)
  .delete(protect, validate(mongoIdParam), deleteService);

export default router;
