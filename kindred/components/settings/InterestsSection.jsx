import React, { useState } from 'react';

const InterestsSection = React.memo(({ user, updateUser }) => {
  const [newInterest, setNewInterest] = useState('');

  const addInterest = () => {
    if (newInterest.trim()) {
      updateUser({ interests: [...user.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (index) => {
    updateUser({ interests: user.interests.filter((_, i) => i !== index) });
  };

  return (
    <div className="interests-section">
      <h3>Interests</h3>
      <div className="add-interest">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Add an interest"
        />
        <button onClick={addInterest}>Add</button>
      </div>
      <ul>
        {user.interests.map((interest, index) => (
          <li key={index}>
            {interest} <button onClick={() => removeInterest(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default InterestsSection;