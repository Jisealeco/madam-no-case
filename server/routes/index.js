import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse.js';
import authRoutes from './authRoutes.js';
import contactRoutes from './contactRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import productRoutes from './productRoutes.js';
import serviceRoutes from './serviceRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  sendSuccess(res, { data: { status: 'ok', database: dbState, uptime: Math.round(process.uptime()) } });
});

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/services', serviceRoutes);
router.use('/products', productRoutes);
router.use('/gallery', galleryRoutes);

export default router;
