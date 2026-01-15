import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Environment', 'Education', 'Social Work', 'Healthcare', 'Animal Welfare', 'Disaster Relief']
  },
  date: {
    type: Date,
    default: Date.now
  },
  pointsEarned: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('JournalEntry', journalEntrySchema);
