import e, { Router } from 'express';
import { slackAuth, slackCallback } from '../controllers/slack.controller';


const router = Router();

router.get('/auth', slackAuth);
       
router.get('/oauth/callback', slackCallback);

export default router;
