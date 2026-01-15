import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all visible community members
router.get('/members', async (req, res) => {
  try {
    const { location, interest } = req.query;

    let query = { isCommunityVisible: true };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (interest) {
      query.interests = { $in: [interest] };
    }

    const members = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single community member
router.get('/members/:userId', async (req, res) => {
  try {
    const member = await User.findById(req.params.userId)
      .select('-password');

    if (!member || !member.isCommunityVisible) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      locations,
      interests
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
