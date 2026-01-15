import React, { useState, useEffect } from 'react';
import ActionForm from './ActionForm';
import PageHeader from './PageHeader';
import JournalTimeline from './JournalTimeline';
import "./HeroJournal.css";

const initialTracks = [
  { id: 't1', name: 'Environment', points: 1250, color: '#10b981' }, 
  { id: 't2', name: 'Education', points: 980, color: '#3b82f6' },   
  { id: 't3', name: 'Social Work', points: 850, color: '#f59e0b' },
  { id: 't4', name: 'Healthcare', points: 400, color: '#ef4444' },
  { id: 't5', name: 'Animal Welfare', points: 300, color: '#ec4899' },
  { id: 't6', name: 'Disaster Relief', points: 150, color: '#6366f1' },
];

export default function HeroJournal() {
  const [tracks] = useState(initialTracks);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('journalEntries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const onAddEntry = (entry) => {
    const newEntries = [...entries, { ...entry, id: Date.now() }];
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));

    // Increase points for the category
    const updatedTracks = tracks.map(track => 
      track.name === entry.category ? { ...track, points: track.points + 10 } : track
    );
    // Note: Since tracks is state, but for simplicity, update localStorage
    localStorage.setItem('userTracks', JSON.stringify(updatedTracks));
  };

  return (
    <div className="journal-container">
      <PageHeader title="Hero Journal" description="Document your actions and reflect on your impact." />
      <div className="journal-grid">
        <ActionForm tracks={tracks} onSubmit={onAddEntry} />
        <JournalTimeline entries={entries} />
      </div>
    </div>
  );
}