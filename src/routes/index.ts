import { Router } from 'express';

import reportRoutes from './report.routes';
import journeyRoutes from './journey.routes';
import fareRoutes from './fare.routes';
import csvRoutes from './csv.routes';

const router = Router();


router.use('/journeys', journeyRoutes);
router.use('/reports', reportRoutes);
router.use('/fare', fareRoutes);
router.use('/csv', csvRoutes);

export default router;