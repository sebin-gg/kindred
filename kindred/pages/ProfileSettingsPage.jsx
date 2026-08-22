import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/settings/PageHeader.jsx';
import BasicInfoSection from '../components/settings/BasicInfoSection.jsx';
import InterestsSection from '../components/settings/InterestsSection.jsx';
import VisibilitySection from '../components/settings/visibilitySection.jsx';
import SaveBar from '../components/settings/SaveBar.jsx';
import './profilesettingspage.css';

function ProfileSettingsPage() {
  const userId = localStorage.getItem('currentUserId') || (() => {
    const randomId = 'user_' + (
      globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, '0')).join('')
    );
    localStorage.setItem('currentUserId', randomId);
    return randomId;
  })();
  const [user, setUser] = useState({
    id: userId,
    name: '',
    location: '',
    title: '',
    bio: '',
    interests: [],
    isCommunityVisible: false
  });

  useEffect(() => {
    const stored = localStorage.getItem(`user_${userId}`);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [userId]);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(() => {
    if (!/^user_[0-9a-f-]+$/.test(userId)) return; // sanitize before persisting
    localStorage.setItem(`user_${userId}`, JSON.stringify(user));
    alert('Settings saved!');
  }, [userId, user]);

  // Commented out: if (!userId) { return <div>Please log in first to access profile settings.</div>; }

  return (
    <div className="profile-settings-page">
      <PageHeader />
      <BasicInfoSection user={user} updateUser={updateUser} />
      <InterestsSection user={user} updateUser={updateUser} />
      <VisibilitySection user={user} updateUser={updateUser} />
      <SaveBar onSave={handleSave} />
    </div>
  );
}

export default ProfileSettingsPage;
