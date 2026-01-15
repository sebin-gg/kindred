import React, { useState, useEffect } from 'react';
import ActionForm from './ActionForm';
import PageHeader from './PageHeader';
import JournalTimeline from './JournalTimeline';
import "./HeroJournal.css";
import { journalAPI, userAPI } from '../services/api';

const TRACK_COLORS = {
  Environment: '#10b981',
  Education: '#3b82f6',
  'Social Work': '#f59e0b',
  Healthcare: '#ef4444',
  'Animal Welfare': '#ec4899',
  'Disaster Relief': '#6366f1',
};

export default function HeroJournal() {
  const [tracks, setTracks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [apiTracks, apiEntries] = await Promise.all([
          userAPI.getTracks(),
          journalAPI.getEntries(),
        ]);

        const mappedTracks = apiTracks.map((track, index) => ({
          id: track._id || `track-${index}`,
          name: track.name,
          points: track.points ?? 0,
          color: TRACK_COLORS[track.name] || '#6366f1',
        }));

        const mappedEntries = apiEntries.map(entry => ({
          ...entry,
          id: entry._id || entry.id,
        }));

        setTracks(mappedTracks);
        setEntries(mappedEntries);
      } catch (err) {
        console.error('Failed to load journal data:', err);
        setError('Could not load your journal yet. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const onAddEntry = async (entry) => {
    try {
      setError(null);
      // Create entry in backend – this also increments track points there
      const response = await journalAPI.createEntry(entry.content, entry.category);
      const createdEntry = {
        ...response.entry,
        id: response.entry._id || response.entry.id,
      };

      // Show newest first
      setEntries(prev => [createdEntry, ...prev]);

      // Refresh tracks from backend so points stay in sync with MongoDB
      const updatedTracks = await userAPI.getTracks();
      const mappedTracks = updatedTracks.map((track, index) => ({
        id: track._id || `track-${index}`,
        name: track.name,
        points: track.points ?? 0,
        color: TRACK_COLORS[track.name] || '#6366f1',
      }));
      setTracks(mappedTracks);
    } catch (err) {
      console.error('Failed to add journal entry:', err);
      setError(err.message || 'Could not save your entry. Please try again.');
    }
  };

  return (
    <div className="journal-container">
      <PageHeader title="Hero Journal" description="Document your actions and reflect on your impact." />
      <div className="journal-grid">
        <ActionForm tracks={tracks} onSubmit={onAddEntry} />
        <div>
          {loading && <p>Loading your journal...</p>}
          {error && !loading && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && <JournalTimeline entries={entries} />}
        </div>
      </div>
    </div>
  );
}