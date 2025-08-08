import e, { Router } from 'express';
import { getChannels } from '../controllers/channel.controller';
import { tokenRotation } from '../middlewares/checkandrefreshToken';

const router = Router();

router.get('/', tokenRotation, getChannels);


export default router;
