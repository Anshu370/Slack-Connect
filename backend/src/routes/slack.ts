import e, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { slackAuth, slackCallback } from '../controllers/slack.controller';

dotenv.config();

const router = Router();

router.get('/slack', slackAuth);
       
router.get('/oauth/callback', slackCallback);

export default router;
