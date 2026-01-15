import React from 'react';

const BasicInfoSection = React.memo(({ user, updateUser }) => {
  return (
    <div className="basic-info-section">
      <h3>Basic Information</h3>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => updateUser({ name: e.target.value })}
          placeholder="Enter your name"
        />
      </div>
      <div className="form-group">
        <label>Location:</label>
        <input
          type="text"
          value={user.location}
          onChange={(e) => updateUser({ location: e.target.value })}
          placeholder="Enter your location"
        />
      </div>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={user.title}
          onChange={(e) => updateUser({ title: e.target.value })}
          placeholder="Enter your title"
        />
      </div>
      <div className="form-group">
        <label>Bio:</label>
        <textarea
          value={user.bio}
          onChange={(e) => updateUser({ bio: e.target.value })}
          placeholder="Tell us about yourself"
        />
      </div>
    </div>
  );
});

export default BasicInfoSection;