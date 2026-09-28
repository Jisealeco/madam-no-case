import { matchedData } from 'express-validator';
import { GALLERY_CATEGORIES } from '../config/constants.js';
import GalleryImage from '../models/GalleryImage.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { removeUploadedFile, resolveImage } from '../utils/files.js';

function pickFields(req) {
  const { imageUrl, ...fields } = matchedData(req, { locations: ['body'] });
  const image = resolveImage(req);
  if (image) fields.image = image;
  return fields;
}

// GET /api/gallery?category=
export async function listGallery(req, res) {
  const { category } = matchedData(req, { locations: ['query'] });
  const images = await GalleryImage.find(category ? { category } : {}).sort({ order: 1, createdAt: -1 });
  sendSuccess(res, { data: images, meta: { total: images.length, categories: GALLERY_CATEGORIES } });
}

// POST /api/gallery  (admin)
export async function createGalleryImage(req, res) {
  const image = await GalleryImage.create(pickFields(req));
  sendSuccess(res, { status: 201, message: 'Image added to gallery', data: image });
}

// PUT /api/gallery/:id  (admin)
export async function updateGalleryImage(req, res) {
  const item = await GalleryImage.findById(req.params.id);
  if (!item) throw ApiError.notFound('Gallery image not found');

  const previousImage = item.image;
  item.set(pickFields(req));
  await item.save();

  if (previousImage !== item.image) await removeUploadedFile(previousImage);
  sendSuccess(res, { message: 'Gallery image updated', data: item });
}

// DELETE /api/gallery/:id  (admin)
export async function deleteGalleryImage(req, res) {
  const item = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('Gallery image not found');
  await removeUploadedFile(item.image);
  sendSuccess(res, { message: 'Gallery image deleted', data: { id: item.id } });
}
