import express from 'express';
import User from '../models/User.js';

const router = express.Router();

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get all visible community members
// Public by design, but only safe directory fields are exposed (never email,
// tracks, titles, or internal ids beyond the profile id).
router.get('/members', async (req, res) => {
  try {
    const { location, interest } = req.query;

    let query = { isCommunityVisible: true };

    if (typeof location === 'string' && location.trim()) {
      query.location = { $regex: escapeRegex(location.trim().slice(0, 100)), $options: 'i' };
    }

    if (typeof interest === 'string' && interest.trim()) {
      query.interests = { $in: [interest.trim().slice(0, 100)] };
    }

    const members = await User.find(query)
      .select('name title location bio interests isCommunityVisible createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(members);
  } catch {
    res.status(500).json({ error: 'Failed to load members' });
  }
});

// Get single community member
router.get('/members/:userId', async (req, res) => {
  try {
    const member = await User.findById(req.params.userId)
      .select('name title location bio interests isCommunityVisible createdAt');

    if (!member?.isCommunityVisible) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch {
    res.status(500).json({ error: 'Failed to load member' });
  }
});

// Get community statistics
router.get('/stats', async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ isCommunityVisible: true });
    const locations = await User.distinct('location', { isCommunityVisible: true });
    const interests = await User.distinct('interests', { isCommunityVisible: true });

    res.json({
      totalMembers,
      locations: locations.filter((l) => typeof l === 'string' && l).slice(0, 200),
      interests: interests.filter((i) => typeof i === 'string' && i).slice(0, 200)
    });
  } catch {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

export default router;
