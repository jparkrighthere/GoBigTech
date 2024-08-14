import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router/router';
import path from 'path';

// Load environment variables from .env file
dotenv.config({path: path.resolve(__dirname, '../../.env')});

const app = express();
const port = process.env.PORT || '';
const url = process.env.MONGO_URI || '';

// MongoDB connection
mongoose
  .connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
