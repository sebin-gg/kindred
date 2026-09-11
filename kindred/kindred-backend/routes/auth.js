import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

const DEFAULT_TRACKS = [
  { name: 'Environment', points: 0 },
  { name: 'Education', points: 0 },
  { name: 'Social Work', points: 0 },
  { name: 'Healthcare', points: 0 },
  { name: 'Animal Welfare', points: 0 },
  { name: 'Disaster Relief', points: 0 }
];

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: String(email) });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      tracks: [
        { name: 'Environment', points: 0 },
        { name: 'Education', points: 0 },
        { name: 'Social Work', points: 0 },
        { name: 'Healthcare', points: 0 },
        { name: 'Animal Welfare', points: 0 },
        { name: 'Disaster Relief', points: 0 }
      ]
    });

    await user.save();

    // Generate token
    const token = signToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: String(email) });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.currentTitle
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guest login — one click, no form. Creates a throwaway guest account with a
// random password (bcrypt-hashed by the User model) and returns a JWT.
// The password is never sent back to the client, so only the token is stored.
router.post('/guest', async (req, res) => {
  try {
    const guestId = crypto.randomBytes(6).toString('hex');
    const user = new User({
      name: `Guest ${guestId.slice(0, 4).toUpperCase()}`,
      email: `guest-${guestId}@kindred.guest`,
      password: crypto.randomBytes(32).toString('hex'),
      isGuest: true,
      isCommunityVisible: false,
      tracks: DEFAULT_TRACKS
    });

    await user.save();

    const token = signToken(user);

    res.status(201).json({
      message: 'Guest session created',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isGuest: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
