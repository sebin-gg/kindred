import React from 'react';

function SaveBar({ onSave }) {
  return (
    <div className="save-bar">
      <button onClick={onSave}>Save Changes</button>
    </div>
  );
}

export default SaveBar;