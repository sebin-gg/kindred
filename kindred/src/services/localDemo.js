// Local-only demo store. Used when the backend is unreachable (e.g. the
// static Vercel demo) so a guest's full loop — log action → earn points →
// grow title — still works. Everything lives in localStorage, scoped per
// guest id, and never touches the network.
//
// Entry shape mirrors the backend ({ _id, content, category, pointsEarned,
// createdAt }) plus the `date`/`id` fields the timeline components read.

export const TRACK_NAMES = [
  'Environment',
  'Education',
  'Social Work',
  'Healthcare',
  'Animal Welfare',
  'Disaster Relief',
];

export const POINTS_PER_ENTRY = 10;

const entriesKey = (userId) => `kindred_demo_entries_${userId}`;

export const getLocalEntries = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(entriesKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setLocalEntries = (userId, entries) => {
  localStorage.setItem(entriesKey(userId), JSON.stringify(entries));
};

export const createLocalEntry = (userId, { content, category }) => {
  const now = new Date();
  const entry = {
    _id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    content,
    category,
    pointsEarned: POINTS_PER_ENTRY,
    date: now.toLocaleDateString(),
    createdAt: now.toISOString(),
  };
  entry.id = entry._id;
  const entries = [entry, ...getLocalEntries(userId)];
  setLocalEntries(userId, entries);
  return entry;
};

// Points are derived from entries (10 per entry), exactly like the backend
// does, so journal and hero space always agree. Shape matches GET /users/tracks.
export const getLocalTracks = (userId) => {
  const pointsByTrack = Object.fromEntries(TRACK_NAMES.map((name) => [name, 0]));
  for (const entry of getLocalEntries(userId)) {
    if (entry.category in pointsByTrack) {
      pointsByTrack[entry.category] += entry.pointsEarned ?? POINTS_PER_ENTRY;
    }
  }
  return TRACK_NAMES.map((name) => ({ name, points: pointsByTrack[name] }));
};
