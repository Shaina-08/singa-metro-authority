import { CSVController } from '../controllers/csv.controller';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();
const csvController = new CSVController();
const upload = multer({ dest: path.join(__dirname, '../../uploads/') });
router.post('/', upload.single('file'), csvController.uploadAndProcessCSV);

export default router;
