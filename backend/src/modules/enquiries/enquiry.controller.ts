import { Request, Response, NextFunction } from 'express';
import { Enquiry } from './enquiry.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/app.error.js';

export const createEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, phone, grade, schoolName, subjectsOfInterest, message } = req.body;

    const enquiry = await Enquiry.create({
      fullName,
      email,
      phone,
      grade,
      schoolName,
      subjectsOfInterest,
      message,
    });

    return sendSuccess(res, enquiry, 'Thank you! Your admission enquiry has been submitted. Our team will contact you shortly.', 201);
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.grade) filter.grade = req.query.grade;

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, enquiries, 'Enquiries retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, adminNotes } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!enquiry) throw AppError.notFound('Enquiry not found');
    return sendSuccess(res, enquiry, 'Enquiry updated');
  } catch (error) {
    next(error);
  }
};
