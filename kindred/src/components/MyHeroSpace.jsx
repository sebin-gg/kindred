import React, { useState } from 'react';
import "./MyHeroSpace.css"; 
import PageHeader from "./PageHeader";
import TrackStatsSection from "./TrackStatsSection";
import CurrentTitleCard from "./CurrentTitleCard";
import { getCurrentTitle } from "../data/titles";

const initialTracks = [
  { id: 't1', name: 'Environment', points: 1250, color: '#10b981' }, 
  { id: 't2', name: 'Education', points: 980, color: '#3b82f6' },   
  { id: 't3', name: 'Social Work', points: 850, color: '#f59e0b' },
  { id: 't4', name: 'Healthcare', points: 400, color: '#ef4444' },
  { id: 't5', name: 'Animal Welfare', points: 300, color: '#ec4899' },
  { id: 't6', name: 'Disaster Relief', points: 150, color: '#6366f1' },
];

function getInitialTracks() {
  const savedTracks = localStorage.getItem('userTracks');
  return savedTracks ? JSON.parse(savedTracks) : initialTracks;
}

function getInitialTitle() {
  const savedTitle = localStorage.getItem('currentTitle');
  const tracks = getInitialTracks();
  return savedTitle || getCurrentTitle(tracks);
}

export default function MyHeroSpace() {
  const [userTracks] = useState(getInitialTracks);
  const [currentTitle, setCurrentTitle] = useState(getInitialTitle);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerate = () => {
    setIsAnimating(true);
    // Simulate merging animation
    setTimeout(() => {
      const newTitle = getCurrentTitle(userTracks);
      setCurrentTitle(newTitle);
      localStorage.setItem('currentTitle', newTitle);
      setIsAnimating(false);
    }, 3000); // Longer for animation
  };

  const topTracks = userTracks.sort((a,b) => b.points - a.points).slice(0,3);

  return (
    <div className="hero-container">
      <PageHeader />
      <div className="dashboard-grid">
        <div className="primary-view">
          <TrackStatsSection tracks={userTracks} />
        </div>
        <div className="stats-view">
          <CurrentTitleCard title={currentTitle} isAnimating={isAnimating} onGenerate={handleGenerate} topTracks={topTracks} />
        </div>
      </div>
    </div>
  );
}