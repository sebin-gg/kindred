import express from 'express';
import authenticateToken from '../middleware/auth.js';
import JournalEntry from '../models/JournalEntry.js';
import User from '../models/User.js';

const router = express.Router();

// Create journal entry
router.post('/entries', authenticateToken, async (req, res) => {
  try {
    const { content, category } = req.body;

    if (typeof content !== 'string' || !content.trim() || typeof category !== 'string') {
      return res.status(400).json({ error: 'Content and category required' });
    }

    // Ownership equivalent of `.eq("user_id", user.id)` + RLS `auth.uid()`:
    // the owner is always taken from the verified JWT, never from the client.
    const entry = new JournalEntry({
      userId: req.user.id,
      content: content.trim().slice(0, 5000),
      category,
      pointsEarned: 10
    });

    await entry.save();

    // Update user track points
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const track = user.tracks.find(t => t.name === category);
    if (track) {
      track.points += 10;
    }
    await user.save();

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Get user's journal entries
// Ownership check: only rows owned by the logged-in user are returned.
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(200);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load entries' });
  }
});

// Delete journal entry
router.delete('/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    // Atomic ownership check (BOLA fix): the delete only succeeds when the
    // row's userId matches the logged-in user. This is the Mongo equivalent
    // of `.eq("user_id", user.id)` plus an RLS `auth.uid()` policy.
    const deleted = await JournalEntry.deleteOne({ _id: req.params.entryId, userId: req.user.id });

    if (deleted.deletedCount === 0) {
      const exists = await JournalEntry.exists({ _id: req.params.entryId });
      return res.status(exists ? 403 : 404).json({ error: exists ? 'Unauthorized' : 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;
