import ScheduledMessage from './models/schedulemessage.model';
import Workspace from './models/workspace.model';
import axios from 'axios'; // Assuming you're using axios to send messages via Slack API
import { decrypt } from './services/encryptDecrypt';

interface SendMessageParams {
  authed_user: string;
  teamId: string;
  channel: string;
  text: string;
}

/**
 * Sends a message using Slack's chat.postMessage API.
 * Assumes you have access to the user's access token if using user-level messaging.
 */
const sendMessage = async ({ authed_user, teamId, channel, text }: SendMessageParams) => {
  try {
    // You’ll probably want to fetch the user's access token from your database.
    // For now, this is just a placeholder.
    const userAccessToken = await getUserAccessToken(authed_user, teamId);

    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel,
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.ok) {
      throw new Error(`Slack API error: ${response.data.error}`);
    }

    console.log(`Message sent to channel ${channel}`);
  } catch (err) {
    console.error(`Failed to send message:`, err);
    throw err; // Re-throw to let caller handle it
  }
};

/**
 * Checks the DB for messages that are scheduled and not yet sent,
 * sends them, and marks them as sent.
 */
export const checkAndSendScheduledMessages = async () => {
  try {
    const now = new Date();

    const messagesToSend = await ScheduledMessage.find({
      scheduleTime: { $lte: now },
      Status: "Pending",
    });

    for (const message of messagesToSend) {
      try {
        await sendMessage({
          authed_user: message.userId,
          teamId: message.teamId,
          channel: message.channel,
          text: message.text,
        });

        message.Status = "Done";
        await message.deleteOne();

        console.log(`✅ Marked message as sent (ID: ${message._id})`);
      } catch (err) {
        console.error(` Error sending message ID ${message._id}:`, err);
      }
    }
  } catch (err) {
    console.error('Error checking scheduled messages:', err);
  }
};

async function getUserAccessToken(authed_user: string, teamId: string): Promise<string> {
    const user = await Workspace.findOne({ authed_user, teamid: teamId });
    if (!user) {
        throw new Error(`No Slack user found for authed_user: ${authed_user} and teamId: ${teamId}`);
    }
    const decryptedToken = decrypt(`${user.userAccessToken}`);
    return decryptedToken;
}