import { Router } from 'express';
import { validateResiter } from '../middleware/validateInput';
import { registerController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validateResiter, registerController);

export default router;
