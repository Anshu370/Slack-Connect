import { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

import { decrypt } from '../services/encryptDecrypt';

dotenv.config();

// controller for retrieving all channels
export const getChannels = async (req: Request, res: Response) => {


    try {
        const decryptedToken = decrypt(`${req.workspace.accessToken}`);
        // console.log('Decrypted Token:', decryptedToken);
        const response = await axios.get('https://slack.com/api/conversations.list', {
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
            }
        });
        
        const simplifiedChannels = response.data.channels.map((channel: any) => ({
            id: channel.id,
            name: channel.name,
            is_private: channel.is_private
        }));

        res.json({ "channels": simplifiedChannels });
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
};