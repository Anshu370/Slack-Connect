import { Router } from 'express';
import { instantMessage } from '../controllers/message.controller';
import { scheduleMessage, getscheduleMessage, deleteschedulemessage } from '../controllers/schedulemessage.controller';
import { tokenRotation } from '../middlewares/checkandrefreshToken';

const router = Router();

router.post('/instant-send', tokenRotation, instantMessage);

router.post('/schedule-message', tokenRotation, scheduleMessage);
router.get('/get-message', tokenRotation, getscheduleMessage);
router.delete('/delete-message', tokenRotation, deleteschedulemessage);

export default router;