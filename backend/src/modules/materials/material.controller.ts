import { Response, NextFunction } from 'express';
import { StudyMaterial } from './material.model.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const getMaterials = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.subjectId) filter.subject = req.query.subjectId;
    if (req.query.batchId) filter.batch = req.query.batchId;

    const materials = await StudyMaterial.find(filter)
      .populate('subject', 'name code')
      .populate('batch', 'name code')
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    return sendSuccess(res, materials, 'Study materials retrieved');
  } catch (error) {
    next(error);
  }
};

export const createMaterial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, fileUrl, fileName, fileSize, mimeType, grade, subjectId, batchId, chapter } = req.body;

    const material = await StudyMaterial.create({
      title,
      description,
      fileUrl: fileUrl || '/uploads/sample-material.pdf',
      fileName: fileName || 'sample-notes.pdf',
      fileSize: fileSize || 1024 * 500,
      mimeType: mimeType || 'application/pdf',
      grade,
      subject: subjectId,
      batch: batchId || undefined,
      chapter,
      uploadedBy: req.user!.userId,
    });

    return sendSuccess(res, material, 'Study material uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) throw AppError.notFound('Study material not found');

    // Only Admin or the teacher who uploaded can delete
    if (req.user?.role !== 'ADMIN' && material.uploadedBy.toString() !== req.user?.userId) {
      throw AppError.forbidden('You do not have permission to delete this file');
    }

    await material.deleteOne();
    return sendSuccess(res, null, 'Study material removed');
  } catch (error) {
    next(error);
  }
};
