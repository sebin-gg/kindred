import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import journalRoutes from './routes/journal.js';
import communityRoutes from './routes/community.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = new Set([
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean));

app.disable('x-powered-by');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Rate limiting: global API limiter plus stricter limiter for auth endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use('/api', apiLimiter);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kindred';

try {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  });
  console.log('? MongoDB connected successfully');
  console.log(`?? Database: ${mongoose.connection.name}`);
} catch (err) {
  console.error('? MongoDB connection error:', err.message);
  console.log('\n??  Troubleshooting steps:');
  console.log('1. Make sure MongoDB is running:');
  console.log('   - Windows: Check Services (services.msc) for "MongoDB"');
  console.log('   - Or run: net start MongoDB');
  console.log('2. Verify MongoDB is listening on port 27017:');
  console.log('   - Run: netstat -ano | findstr 27017');
  console.log('3. Check MongoDB connection string:', MONGODB_URI);
  console.log('\n??  Server will still run, but database operations may fail');
}

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/community', communityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
