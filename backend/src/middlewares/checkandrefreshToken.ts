import axios from 'axios';
import { Request, Response } from 'express';
import { encrypt, decrypt } from '../services/encryptDecrypt';

declare global {
  namespace Express {
    interface Request {
      workspace?: any;
    }
  }
}

// Import Database
import Workspace from '../models/workspace.model';

export const tokenRotation = async (req: Request, res: Response, next: Function) => {
    try {
        const teamId = req.body?.teamId || req.query?.teamId;;

        if (!teamId) {
        return res.status(400).json({ error: 'Team ID is required' });
        }

        const workspace = await Workspace.findOne({ teamId });

        if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
        }

        const now = new Date();
        const expiresAt = new Date(`${workspace.expiresAt}`);
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        let needsRefresh = expiresAt <= oneHourFromNow;

        if (!needsRefresh) {
        try {
            const decryptedToken = decrypt(`${workspace.refreshToken}`);
            const authResp = await axios.post(
            'https://slack.com/api/auth.test',
            null,
            {
                headers: {
                Authorization: `Bearer ${decryptedToken}`, // decrypt if stored encrypted
                },
            }
            );

            if (!authResp.data.ok) {
            console.warn(`Slack token invalid: ${authResp.data.error}`);
            needsRefresh = true;
            }
        } catch (err) {
            console.error('Error verifying Slack token:', err);
            needsRefresh = true; // fallback to refresh on error
        }
        }

        if (needsRefresh) {
        try {
            const decryptedToken = decrypt(`${workspace.refreshToken}`);
            const response = await axios.post('https://slack.com/api/oauth.v2.access',
            new URLSearchParams({
                client_id: `${process.env.SLACK_CLIENT_ID}`,
                client_secret: `${process.env.SLACK_CLIENT_SECRET}`,
                refresh_token: decryptedToken,
                grant_type: 'refresh_token',
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
            );

            const data = response.data;

            if (data.ok) {
            const { access_token, expires_in } = data;
            workspace.accessToken = encrypt(access_token);
            workspace.expiresAt = new Date(Date.now() + expires_in * 1000);
            await workspace.save();
            } else {
            console.error('Error refreshing token:', data.error);
            return res.status(500).json({ error: 'Failed to refresh token' });
            }
        } catch (err) {
            console.error('Slack refresh token request failed:', err);
            return res.status(500).json({ error: 'Slack token refresh failed' });
        }
        }

        req.workspace = workspace;
        return next();

  } catch (error) {
    console.error('Error during token rotation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
