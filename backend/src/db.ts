import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/slackdata`);
        console.log('MongoDB connected successfully');
    } catch (err: any) {
        console.error('MongoDB connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
