import { matchedData } from 'express-validator';
import Service from '../models/Service.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { removeUploadedFileIfUnused, resolveImage } from '../utils/files.js';

function pickFields(req) {
  const { imageUrl, ...fields } = matchedData(req, { locations: ['body'] });
  const image = resolveImage(req);
  if (image !== undefined) fields.image = image;
  return fields;
}

// GET /api/services — public sees active services; an admin can add ?all=true.
export async function listServices(req, res) {
  const showAll = Boolean(req.admin) && req.query.all === 'true';
  const services = await Service.find(showAll ? {} : { isActive: true }).sort({ order: 1, createdAt: 1 });
  sendSuccess(res, { data: services, meta: { total: services.length } });
}

// GET /api/services/:idOrSlug
export async function getService(req, res) {
  const { id } = req.params;
  const service = /^[a-f\d]{24}$/i.test(id) ? await Service.findById(id) : await Service.findOne({ slug: id });
  if (!service || (!service.isActive && !req.admin)) throw ApiError.notFound('Service not found');
  sendSuccess(res, { data: service });
}

// POST /api/services  (admin)
export async function createService(req, res) {
  const service = await Service.create(pickFields(req));
  sendSuccess(res, { status: 201, message: 'Service created', data: service });
}

// PUT /api/services/:id  (admin)
export async function updateService(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) throw ApiError.notFound('Service not found');

  const previousImage = service.image;
  service.set(pickFields(req));
  await service.save();

  if (previousImage !== service.image) await removeUploadedFileIfUnused(previousImage);
  sendSuccess(res, { message: 'Service updated', data: service });
}

// DELETE /api/services/:id  (admin)
export async function deleteService(req, res) {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw ApiError.notFound('Service not found');
  await removeUploadedFileIfUnused(service.image);
  sendSuccess(res, { message: 'Service deleted', data: { id: service.id } });
}
