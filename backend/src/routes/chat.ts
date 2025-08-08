import { Router } from 'express';
import { instantMessage } from '../controllers/message.controller';
import { tokenRotation } from '../middlewares/checkandrefreshToken';

const router = Router();

router.post('/instant-send', tokenRotation, instantMessage);


export default router;