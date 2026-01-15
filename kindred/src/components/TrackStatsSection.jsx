import React from 'react';

export default function TrackStatsSection({ tracks }) {
  return (
    <div className="track-stats">
      <h3>Your Tracks</h3>
      {tracks.map(track => (
        <div key={track.id} className="track">
          <div className="track-name" style={{color: track.color}}>{track.name}</div>
          <div className="track-points">{track.points} pts</div>
        </div>
      ))}
    </div>
  );
}