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

const MAX_LOCAL_ENTRIES = 200;
const MAX_ENTRY_CONTENT_LENGTH = 5000;
const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

const isSafeId = (value) => typeof value === 'string' && SAFE_ID_PATTERN.test(value);

const entriesKey = (userId) => `kindred_demo_entries_${userId}`;

const normalizeEntry = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const id = isSafeId(value._id) ? value._id : null;
  const fallbackId = isSafeId(value.id) ? value.id : null;
  const safeId = id ?? fallbackId;
  if (!safeId || typeof value.content !== 'string' || !TRACK_NAMES.includes(value.category)) return null;

  const timestamp = typeof value.createdAt === 'string' ? Date.parse(value.createdAt) : Number.NaN;
  if (!Number.isFinite(timestamp)) return null;

  const timestampDate = new Date(timestamp);
  if (Number.isNaN(timestampDate.getTime())) return null;

  const createdAt = timestampDate.toISOString();
  const date = typeof value.date === 'string' && value.date.length <= 64
    ? value.date
    : timestampDate.toLocaleDateString();

  // Rebuild from the known fields. Stored objects are untrusted and must not
  // carry arbitrary properties or user-controlled point totals into the UI.
  return {
    _id: safeId,
    id: safeId,
    content: value.content.slice(0, MAX_ENTRY_CONTENT_LENGTH),
    category: value.category,
    pointsEarned: POINTS_PER_ENTRY,
    date,
    createdAt,
  };
};

export const getLocalEntries = (userId) => {
  if (!isSafeId(userId)) return [];
  try {
    const raw = localStorage.getItem(entriesKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.slice(0, MAX_LOCAL_ENTRIES).map(normalizeEntry).filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

const setLocalEntries = (userId, entries) => {
  if (!isSafeId(userId) || !Array.isArray(entries)) return;
  const safeEntries = entries
    .slice(0, MAX_LOCAL_ENTRIES)
    .map(normalizeEntry)
    .filter(Boolean);
  localStorage.setItem(entriesKey(userId), JSON.stringify(safeEntries));
};

export const createLocalEntry = (userId, { content, category }) => {
  if (!isSafeId(userId)) throw new TypeError('Invalid local demo user id');

  const now = new Date();
  const entry = normalizeEntry({
    _id: `local-${crypto.randomUUID()}`,
    content,
    category,
    pointsEarned: POINTS_PER_ENTRY,
    date: now.toLocaleDateString(),
    createdAt: now.toISOString(),
  });
  if (!entry) throw new TypeError('Invalid local demo entry');

  const entries = [entry, ...getLocalEntries(userId)].slice(0, MAX_LOCAL_ENTRIES);
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
