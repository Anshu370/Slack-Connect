import { Router } from 'express';
import { getChannels } from '../controllers/channel.controller';
import { tokenRotation } from '../middlewares/checkandrefreshToken';

const router = Router();

// Route for retrieving all channels (protected by token rotation middleware)
router.get('/', tokenRotation, getChannels);


export default router;
