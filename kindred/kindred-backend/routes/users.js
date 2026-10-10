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
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, location, title, bio, interests, isCommunityVisible } = req.body;

    const updates = { updatedAt: new Date() };
    if (typeof name === 'string' && name.trim()) updates.name = name.trim().slice(0, 100);
    if (typeof location === 'string') updates.location = location.slice(0, 200);
    if (typeof title === 'string') updates.title = title.slice(0, 100);
    if (typeof bio === 'string') updates.bio = bio.slice(0, 1000);
    if (Array.isArray(interests)) updates.interests = interests.filter(i => typeof i === 'string').map(i => i.slice(0, 100)).slice(0, 50);
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
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user tracks
router.get('/tracks', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('tracks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.tracks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load tracks' });
  }
});

// Update track points
// NOTE: self-awarded points are the remaining integrity risk. Journal creation
// is the trusted path (+10); this endpoint is kept for profile UX but is
// clamped below so a compromised token cannot mint arbitrary points.
router.put('/tracks/:trackName', authenticateToken, async (req, res) => {
  try {
    const { trackName } = req.params;
    const { points } = req.body;

    if (typeof points !== 'number' || !Number.isFinite(points) || points < 0 || points > 100000) {
      return res.status(400).json({ error: 'Points must be a number 0-100000' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
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
    res.status(500).json({ error: 'Failed to update track' });
  }
});

export default router;
