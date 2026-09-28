import { matchedData } from 'express-validator';
import { PRODUCT_AVAILABILITY, PRODUCT_CATEGORIES } from '../config/constants.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { removeUploadedFileIfUnused, resolveImage } from '../utils/files.js';

function pickFields(req) {
  const { imageUrl, ...fields } = matchedData(req, { locations: ['body'] });
  const image = resolveImage(req);
  if (image !== undefined) fields.image = image;
  return fields;
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?category=&availability=&featured=&search=&page=&limit=
export async function listProducts(req, res) {
  const { category, availability, featured, search, page = 1, limit = 24 } = matchedData(req, {
    locations: ['query'],
  });

  const filter = {};
  if (category) filter.category = category;
  if (availability) filter.availability = availability;
  if (featured !== undefined) filter.featured = featured;
  // A RegExp (not a {$regex} object) so mongoose's sanitizeFilter leaves it intact.
  if (search) filter.name = new RegExp(escapeRegex(search), 'i');

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: items,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      categories: PRODUCT_CATEGORIES,
      availability: PRODUCT_AVAILABILITY,
    },
  });
}

// GET /api/products/:id
export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');
  sendSuccess(res, { data: product });
}

// POST /api/products  (admin)
export async function createProduct(req, res) {
  const product = await Product.create(pickFields(req));
  sendSuccess(res, { status: 201, message: 'Product created', data: product });
}

// PUT /api/products/:id  (admin)
export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  const previousImage = product.image;
  product.set(pickFields(req));
  await product.save();

  if (previousImage !== product.image) await removeUploadedFileIfUnused(previousImage);
  sendSuccess(res, { message: 'Product updated', data: product });
}

// DELETE /api/products/:id  (admin)
export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');
  await removeUploadedFileIfUnused(product.image);
  sendSuccess(res, { message: 'Product deleted', data: { id: product.id } });
}
