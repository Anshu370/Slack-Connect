import { Request, Response } from 'express';
import { WebClient } from '@slack/web-api';
import { decrypt } from '../services/encryptDecrypt';

// defining all datatypes in the string
interface InstantMessageBody {
    teamId: string;
    channel: string;
    text: string;
}


interface WorkflowDataRequest extends Request {
    body: InstantMessageBody;
    workflowData?: {
        userAccessToken: string;
    };
}

export const instantMessage = async (req: WorkflowDataRequest, res: Response): Promise<Response> => {
    const { teamId, channel, text } = req.body;

    if (!channel || !text || !teamId) {
        return res.status(400).json({ error: "Channel, text, and Team ID are required" });
    }

    try {
        if (!req.workspace?.userAccessToken) {
            return res.status(400).json({ error: "Access token not found in workspace" });
        }

        const decryptedToken = decrypt(`${req.workspace.userAccessToken}`);
        const web = new WebClient(decryptedToken);

        await web.conversations.join({ channel });

        const result = await web.chat.postMessage({ channel, text });

        return res.status(200).json({
            message: "Message sent successfully",
            data: {
                ok: result.ok,
                channel: result.channel,
                ts: result.ts
            }
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Failed to send message" });
    }
};
