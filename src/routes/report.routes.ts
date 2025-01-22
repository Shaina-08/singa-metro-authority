import { validateDateRange } from '@/middleware/validation.middleware';
import { ReportController } from '../controllers/report.controller';
import { Router } from 'express';


const router = Router();
const reportController = new ReportController();

router.get('/daily', reportController.getDailyReport);
router.get('/weekly', reportController.getWeeklyReport);
router.get('/line-usage', reportController.getLineUsageReport);
router.get('/peak-hours', reportController.getPeakHoursReport);

export default router;