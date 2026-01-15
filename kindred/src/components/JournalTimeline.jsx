import React from 'react';
import JournalEntryCard from "./cards/JournalEntryCard";

export default function JournalTimeline({ entries }) {
  return (
    <div className="journal-timeline">
      {entries.length === 0 ? <p>No entries yet.</p> : entries.map(entry => <JournalEntryCard key={entry.id} entry={entry} />)}
    </div>
  );
}