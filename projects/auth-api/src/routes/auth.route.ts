import { Router } from 'express';
import { validateResiter } from '../middleware/validateInput';

const router = Router();

router.post('/register', validateResiter, registerController);

export default router;
