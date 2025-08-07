import { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

// import Workspace Model
import Workspace from '../models/workspace.model';

dotenv.config();

export const slackAuth = (req: Request, res: Response) => {
    const scopes = [
        'channels:read',
        'groups:read',
        'im:read',
        'mpim:read',
        'users:read',
        'chat:write',
        'channels:history',
        'im:history',
        'channels:join'
    ].join(',');
    const redirecturl = `https://slack.com/oauth/v2/authorize?` +
        `client_id=${process.env.SLACK_CLIENT_ID}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `redirect_uri=${encodeURIComponent(process.env.SLACK_REDIRECT_URI || '')}&`;

    res.redirect(redirecturl);
};

export const slackCallback = async (req: Request, res: Response) => {
    const { code, error, state } = req.query;

    if (error) {
        console.error('Slack OAuth error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/auth/failure?error=${error}`);
    }

    if (!code) {
        console.error('No authorization code received from Slack.');
        return res.redirect(`${process.env.FRONTEND_URL}/auth/failure?error=no_code`);
    }

    try {
        const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
            params: {
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code: code as string,
                redirect_uri: process.env.SLACK_REDIRECT_URI,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const data = response.data;

        if (data.ok) {
            const {
                access_token,
                refresh_token,
                expires_in,
                team,
                authed_user,
                scope,
                bot_user_id,
                app_id,
                enterprise
            } = data;

            const team_id = team?.id;
            const team_name = team?.name;
            const user_id = authed_user?.id;
            const user_access_token = authed_user?.access_token;
            const user_refresh_token = authed_user?.refresh_token;
            const user_expires_in = authed_user?.expires_in;

            if (!team_id || !user_id) {
                console.error('Missing required team_id or user_id from Slack OAuth response');
                return res.redirect(`${process.env.FRONTEND_URL}/auth/failure?error=invalid_response`);
            }

            const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;
            const userExpiresAt = user_expires_in ? new Date(Date.now() + user_expires_in * 1000) : null;


            const workspace = await Workspace.findOneAndUpdate(
                { teamId: team_id },
                {
                    teamName: team_name,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt,
                    scope,
                    userId: user_id,
                    botUserId: bot_user_id,
                    appId: app_id,
                    enterpriseId: enterprise?.id || null,
                    userAccessToken: user_access_token,
                    userRefreshToken: user_refresh_token,
                    userExpiresAt,
                    lastRefreshed: new Date(),
                    isActive: true
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const frontendUrl =process.env.FRONTEND_URL

            const redirectUrl = `${frontendUrl}/auth/success?` +
                `teamId=${team_id}&` +
                `teamName=${encodeURIComponent(team_name)}&` +
                `botUserId=${bot_user_id}&` +
                `userId=${user_id}`;

            console.log(`Redirecting to: ${redirectUrl}`);
            res.redirect(redirectUrl);
        } else {
            console.error('Slack OAuth access error:', data.error);
            res.redirect(`${process.env.FRONTEND_URL}/auth/failure?error=${data.error}`);
        }
    } catch (error: any) {
        console.error('Error during Slack OAuth:', error.message);
        res.redirect(`${process.env.FRONTEND_URL}/auth/failure?error=server_error`);
    }
};