import express from 'express';
import authenticateToken from '../middleware/auth.js';
import JournalEntry from '../models/JournalEntry.js';
import User from '../models/User.js';

const router = express.Router();

// Create journal entry
router.post('/entries', authenticateToken, async (req, res) => {
  try {
    const { content, category } = req.body;

    if (!content || !category) {
      return res.status(400).json({ error: 'Content and category required' });
    }

    // Create entry
    const entry = new JournalEntry({
      userId: req.user.id,
      content,
      category,
      pointsEarned: 10
    });

    await entry.save();

    // Update user track points
    const user = await User.findById(req.user.id);
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
    res.status(500).json({ error: err.message });
  }
});

// Get user's journal entries
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete journal entry
router.delete('/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.entryId);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await JournalEntry.deleteOne({ _id: req.params.entryId });

    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
