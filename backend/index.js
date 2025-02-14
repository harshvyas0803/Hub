import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();
const whitelist = [
  'https://hub-puce-eight.vercel.app',
  'http://localhost:5173'
];

const app = express();
// app.use(cors());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health Check Route
app.get('/', (req, res) => {
  res.send('Hello from the MERN blog!');
});

// Routes
app.use('/api/user', authRoutes); // User authentication routes
app.use('/api/posts', authMiddleware, postRoutes); // Auth required for post creation
app.use('/api/categories', categoryRoutes); // Category routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
