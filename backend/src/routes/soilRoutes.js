import express from 'express';
import { getDistricts, getDistrictById, getDistrictCrops } from '../controllers/soilController.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/districts', validateLanguage, getDistricts);
router.get('/district/:districtId', validateLanguage, getDistrictById);
router.get('/district/:districtId/crops', validateLanguage, getDistrictCrops);

export default router;
