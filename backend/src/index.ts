import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';

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

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Slack Connect Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
