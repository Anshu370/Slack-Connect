import { Router } from 'express';
import { instantMessage } from '../controllers/message.controller';
import { scheduleMessage, getscheduleMessage, deleteschedulemessage } from '../controllers/schedulemessage.controller';
import { tokenRotation } from '../middlewares/checkandrefreshToken';

const router = Router();

// Route for sending an instant message (protected by token rotation middleware)
router.post('/instant-send', tokenRotation, instantMessage);
// Route for scheduling a message (protected by token rotation middleware)
router.post('/schedule-message', tokenRotation, scheduleMessage);
// Route for retrieving scheduled messages (protected by token rotation middleware)
router.get('/get-message', tokenRotation, getscheduleMessage);
// Route for deleting a scheduled message (protected by token rotation middleware)
router.delete('/delete-message', tokenRotation, deleteschedulemessage);

export default router;