import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a Workspace document
export interface WorkspaceInterface extends Document {
    teamId: string;
    teamName: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope: string;
    userId: string; // Slack user ID of the installer
    botUserId?: string; // Bot user ID for the app
    appId?: string; // Slack app ID
    enterpriseId?: string; // Enterprise ID if applicable
    userAccessToken?: string; // User-specific access token
    userRefreshToken?: string; // User-specific refresh token
    userExpiresAt?: Date; // User token expiration
}

// Define the Mongoose schema for Workspace
const WorkspaceSchema: Schema = new Schema({
    teamId: { type: String, required: true, unique: true }, // Slack team ID, unique identifier for a workspace
    teamName: { type: String, required: true },
    accessToken: { type: String, required: true }, 
    refreshToken: { type: String },
    expiresAt: { type: Date },
    scope: { type: String, required: true }, // Scopes granted to the app
    userId: { type: String, required: true }, // The Slack user ID who installed the app
    botUserId: { type: String }, // Bot user ID for the app
    appId: { type: String }, // Slack app ID
    enterpriseId: { type: String }, // Enterprise ID if applicable
    userAccessToken: { type: String },
    userRefreshToken: { type: String },
    userExpiresAt: { type: Date },
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

// Create and export the Workspace model
const Workspace = mongoose.model<WorkspaceInterface>('Workspace', WorkspaceSchema);
export default Workspace;
