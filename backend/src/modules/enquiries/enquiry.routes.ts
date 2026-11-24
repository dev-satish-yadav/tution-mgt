import { Router } from 'express';
import { createEnquiry, getEnquiries, updateEnquiryStatus } from './enquiry.controller.js';
import { authenticate, requireRole } from '../../common/middleware/auth.middleware.js';

const router = Router();

// Public route for landing page & admission enquiries
router.post('/', createEnquiry);

// Admin-managed routes
router.get('/', authenticate, requireRole(['ADMIN']), getEnquiries);
router.patch('/:id', authenticate, requireRole(['ADMIN']), updateEnquiryStatus);

export default router;
