import { Request, Response } from 'express';
import Message from '../models/schedulemessage.model';


// controller for scheduling a message
export const scheduleMessage = async (req: Request, res: Response): Promise<Response> => {

    const { teamId, channel, text, scheduleTime } = req.body;

    // console.log("Received schedule message request:", req.body);
    // console.log("Workspace user ID:", req.workspace?.userId);
    // console.log("teamId:", teamId);
    // console.log("channel:", channel);
    // console.log("text:", text);
    // console.log("scheduleTime:", scheduleTime);

    if (!channel || !text || !teamId || !scheduleTime) {
        return res.status(400).json({ error: "Channel, text, Team ID, and Schedule Time are required" });
    }

    try {
        const message = new Message({
            teamId,
            channel,
            text,
            userId: req.workspace?.userId,
            scheduleTime
        });

        await message.save();

        return res.status(201).json({ message: "Message scheduled successfully" });

    } catch (error) {
        console.error("Error scheduling message:", error);
        return res.status(500).json({ error: "Failed to schedule message" });
    }
};

// controller for retrieving scheduled messages
export const getscheduleMessage = async (req: Request, res: Response): Promise<Response> => {

    const { teamId, userId } = req.query;
    console.log("Fetching scheduled messages for teamId:", teamId, "userId:", userId);

    if (!teamId || !userId) {
        return res.status(400).json({ error: "Team ID and User ID are required" });
    }

    try {
        const messages = await Message.find({ teamId, userId }).sort({ scheduleTime: 1 });
        return res.status(200).json({ ok:true, messages:messages });
    } catch (error) {
        console.error("Error fetching scheduled messages:", error);
        return res.status(500).json({ error: "Failed to fetch scheduled messages" });
    }
};

// controller for deleting a scheduled message
export const deleteschedulemessage = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ error: "Message ID is required" });
    }

    try {
        const result = await Message.deleteOne({ _id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Message not found" });
        }
        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting scheduled message:", error);
        return res.status(500).json({ error: "Failed to delete scheduled message" });
    }
};
