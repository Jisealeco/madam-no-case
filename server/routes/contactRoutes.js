import { Router } from 'express';
import {
  createInquiry,
  deleteInquiry,
  getInquiry,
  listInquiries,
  updateInquiry,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiters.js';
import validate from '../middleware/validate.js';
import { mongoIdParam } from '../validators/common.js';
import { createInquiryRules, listInquiryRules, updateInquiryRules } from '../validators/contactValidators.js';

const router = Router();

router
  .route('/')
  .post(contactLimiter, validate(createInquiryRules), createInquiry)
  .get(protect, validate(listInquiryRules), listInquiries);

router
  .route('/:id')
  .get(protect, validate(mongoIdParam), getInquiry)
  .patch(protect, validate([...mongoIdParam, ...updateInquiryRules]), updateInquiry)
  .delete(protect, validate(mongoIdParam), deleteInquiry);

export default router;
