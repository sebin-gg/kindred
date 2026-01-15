import React, { useEffect, useState } from 'react';
import "./MyHeroSpace.css"; 
import PageHeader from "./PageHeader";
import TrackStatsSection from "./TrackStatsSection";
import CurrentTitleCard from "./CurrentTitleCard";
import { getCurrentTitle } from "../data/titles";
import { userAPI } from "../services/api";

// Fallback colors for each track type
const TRACK_COLORS = {
  Environment: '#10b981',
  Education: '#3b82f6',
  'Social Work': '#f59e0b',
  Healthcare: '#ef4444',
  'Animal Welfare': '#ec4899',
  'Disaster Relief': '#6366f1',
};

const FALLBACK_TRACKS = [
  { id: 't1', name: 'Environment', points: 0, color: TRACK_COLORS.Environment },
  { id: 't2', name: 'Education', points: 0, color: TRACK_COLORS.Education },
  { id: 't3', name: 'Social Work', points: 0, color: TRACK_COLORS['Social Work'] },
  { id: 't4', name: 'Healthcare', points: 0, color: TRACK_COLORS.Healthcare },
  { id: 't5', name: 'Animal Welfare', points: 0, color: TRACK_COLORS['Animal Welfare'] },
  { id: 't6', name: 'Disaster Relief', points: 0, color: TRACK_COLORS['Disaster Relief'] },
];

function getInitialTitle() {
  // Keep whatever the user last generated, or show a gentle default.
  return localStorage.getItem('currentTitle') || 'Newcomer';
}

export default function MyHeroSpace() {
  const [userTracks, setUserTracks] = useState(FALLBACK_TRACKS);
  const [currentTitle, setCurrentTitle] = useState(getInitialTitle);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tracks from the backend so points always come from MongoDB
  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoading(true);
        const apiTracks = await userAPI.getTracks();

        const mapped = apiTracks.map((track, index) => ({
          id: track._id || `track-${index}`,
          name: track.name,
          points: track.points ?? 0,
          color: TRACK_COLORS[track.name] || '#6366f1',
        }));

        setUserTracks(mapped);
      } catch (err) {
        // If anything fails, keep fallback tracks so the UI still works
        console.error('Failed to load tracks from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  const handleGenerate = () => {
    setIsAnimating(true);
    // Simulate merging animation
    setTimeout(() => {
      const sortedTracksForTitle = userTracks.toSorted((a, b) => b.points - a.points);
      const newTitle = getCurrentTitle(sortedTracksForTitle);
      setCurrentTitle(newTitle);
      localStorage.setItem('currentTitle', newTitle);
      setIsAnimating(false);
    }, 3000); // Longer for animation
  };

  const sortedTracksForTop = userTracks.toSorted((a, b) => b.points - a.points);
  const topTracks = sortedTracksForTop.slice(0, 3);

  return (
    <div className="hero-container">
      <PageHeader />
      <div className="dashboard-grid">
        <div className="primary-view">
          <TrackStatsSection tracks={userTracks} loading={loading} />
        </div>
        <div className="stats-view">
          <CurrentTitleCard title={currentTitle} isAnimating={isAnimating} onGenerate={handleGenerate} topTracks={topTracks} />
        </div>
      </div>
    </div>
  );
}