import { Router } from 'express';
import { JourneyController } from '../controllers/journey.controller';
import { validateJourney } from '../middleware/validation.middleware';

const router = Router();
const journeyController = new JourneyController();

router.post('/', journeyController.createJourney);
router.get('/', journeyController.getAllJourneys);
router.get('/user/:userId', journeyController.getUserJourneys);
router.get('/:journeyId', journeyController.getJourneyById);
router.post('/bulk', journeyController.bulkCreateJourneys);

export default router;