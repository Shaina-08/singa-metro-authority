import { Router } from 'express';
import { FareController } from '../controllers/fare.controller';

const router = Router();
const fareController = new FareController();
router.get('/', fareController.calculateFare);
router.get('/bulk', fareController.calculateFaresInBulk);

export default router;