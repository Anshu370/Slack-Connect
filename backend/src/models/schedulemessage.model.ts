import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a Message document
export interface MessageInterface extends Document {
    teamId: string;
    channel: string;
    text: string;
    scheduleTime: Date;
    userId: string; // Slack user ID of the sender
    Status: String; // Whether the message has been sent
    ts: string; // Timestamp of the message
}

// Define the Mongoose schema for Message
const MessageSchema: Schema = new Schema({
    teamId: { type: String, required: true },
    channel: { type: String, required: true },
    text: { type: String, required: true },
    scheduleTime: { type: Date, required: true },
    userId: { type: String },
    status: { type: String, enum:['Pending', 'Done', 'Failed'], default:'Pending'},
    ts: { type: String }
}, { timestamps: true }
);



// Create and export the Message model
const Message = mongoose.model<MessageInterface>('Message', MessageSchema);
export default Message;
