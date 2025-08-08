import e, { Router } from 'express';
import { slackAuth, slackCallback } from '../controllers/slack.controller';


const router = Router();


router.get('/auth', slackAuth);                 // Route for initiating Slack OAuth authentication
router.get('/oauth/callback', slackCallback);  // Route for handling Slack OAuth callback

export default router;
