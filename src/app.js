import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'



dotenv.config()




const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

// test route
app.get("/", (req, res) => {
    res.json({ message: 'Church CRM API is running' })
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`)
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));

export default app;