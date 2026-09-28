import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { mongoIdParam } from '../validators/common.js';
import { createProductRules, listProductRules, updateProductRules } from '../validators/productValidators.js';

const router = Router();

router
  .route('/')
  .get(validate(listProductRules), listProducts)
  .post(protect, uploadImage, validate(createProductRules), createProduct);

router
  .route('/:id')
  .get(validate(mongoIdParam), getProduct)
  .put(protect, uploadImage, validate([...mongoIdParam, ...updateProductRules]), updateProduct)
  .delete(protect, validate(mongoIdParam), deleteProduct);

export default router;
