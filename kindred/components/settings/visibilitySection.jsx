import React from 'react';

const VisibilitySection = React.memo(({ user, updateUser }) => {
  return (
    <div className="visibility-section">
      <h3>Visibility Settings</h3>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={user.isCommunityVisible}
            onChange={(e) => updateUser({ isCommunityVisible: e.target.checked })}
          />
          Make profile visible in community
        </label>
        <p>Allow others in the community to see your profile.</p>
      </div>
    </div>
  );
});

export default VisibilitySection;