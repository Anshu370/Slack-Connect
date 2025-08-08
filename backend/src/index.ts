import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Database configuration 
import connectDB from './db';

// Scheduler 
import { checkAndSendScheduledMessages } from './schedule';

// Routes 
import slackRoutes from './routes/slack';
import  channelRoutes  from './routes/channels';
import chatRoutes from './routes/chat';

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

// Routes
app.use('/slack', slackRoutes);
app.use('/api/slack/channels', channelRoutes);
app.use('/api/slack/chat', chatRoutes);

(async () => {

    // DB connection
    await connectDB();

    // Scheduler
    setInterval(() => { 
      checkAndSendScheduledMessages();
    }, 60 * 1000);

    
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
})();
