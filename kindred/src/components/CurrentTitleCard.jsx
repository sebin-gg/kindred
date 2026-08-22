import React from 'react';

export default function CurrentTitleCard({ title, isAnimating, onGenerate, topTracks }) {
  return (
    <div className={`current-title-card ${isAnimating ? 'animation-scene' : ''}`}>
      {isAnimating && (
        <>
          <div className="falling-badge">🌟</div>
          <div className="falling-badge">🏆</div>
          <div className="falling-badge">✨</div>
          <div className="merging-core">⚡</div>
        </>
      )}
      <h2 className="big-number">{title}</h2>
      <button type="button" onClick={onGenerate} disabled={isAnimating} className="submit-btn">
        {isAnimating ? 'Merging...' : 'Generate New Title'}
      </button>
      <div className="top-tracks">
        <h3>Top Tracks</h3>
        {topTracks.map(track => <div key={track.id}>{track.name}: {track.points} pts</div>)}
      </div>
    </div>
  );
}