import React from 'react';

export default function JournalEntryCard({ entry }) {
  return (
    <div className="journal-entry-card">
      <div className="entry-header">
        <span className="entry-date">{entry.date}</span>
        <span className="entry-category">{entry.category}</span>
      </div>
      <p className="entry-content">{entry.content}</p>
    </div>
  );
}