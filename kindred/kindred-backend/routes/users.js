import express from 'express';
import authenticateToken from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, location, title, bio, interests, isCommunityVisible } = req.body;

    const updates = { updatedAt: new Date() };
    if (typeof name === 'string') updates.name = name;
    if (typeof location === 'string') updates.location = location;
    if (typeof title === 'string') updates.title = title;
    if (typeof bio === 'string') updates.bio = bio;
    if (Array.isArray(interests)) updates.interests = interests.filter(i => typeof i === 'string');
    if (typeof isCommunityVisible === 'boolean') updates.isCommunityVisible = isCommunityVisible;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user tracks
router.get('/tracks', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update track points
router.put('/tracks/:trackName', authenticateToken, async (req, res) => {
  try {
    const { trackName } = req.params;
    const { points } = req.body;

    const user = await User.findById(req.user.id);
    const track = user.tracks.find(t => t.name === trackName);

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    track.points = points;
    await user.save();

    res.json({
      message: 'Track updated successfully',
      tracks: user.tracks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
