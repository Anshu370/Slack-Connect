import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Database configuration 
import connectDB from './db';

// Routes 
import slackRoutes from './routes/slack';
import  channelRoutes  from './routes/channels';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL?.split(',') || '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/slack', slackRoutes);
app.use('/api/slack/channels', channelRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
