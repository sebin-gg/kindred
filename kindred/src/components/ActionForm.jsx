import React, { useState } from 'react';

export default function ActionForm({ tracks, onSubmit }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content, category, date: new Date().toLocaleDateString() });
    setContent('');
    setCategory('');
  };

  return (
    <div className="form-group">
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        {tracks.map(track => <option key={track.id} value={track.name}>{track.name}</option>)}
      </select>
      <label>Action Description</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe your action..." />
      <button type="submit" onClick={handleSubmit} className="submit-btn">Add Entry</button>
    </div>
  );
}