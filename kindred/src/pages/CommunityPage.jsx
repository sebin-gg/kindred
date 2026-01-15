// CommunityPage.jsx
import { useState } from "react";
import { mockUsers } from "../data/users";

// Inline CSS styles
const styles = `
/* Global Page Styles */
.community-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #1a1a1a;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Header Section */
.community-header {
  width: 100%;
  padding: 48px 32px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 16px;
  color: #555;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.member-count {
  font-size: 13px;
  color: #777;
  margin: 0;
}

/* Two Column Layout */
.community-layout {
  width: 100%;
  padding: 32px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  box-sizing: border-box;
}

/* Left Column - Refine Panel */
.refine-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 28px;
  height: fit-content;
  position: sticky;
  top: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.refine-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 24px 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.filter-select {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.filter-select:hover {
  border-color: #a5b4fc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.filter-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Right Column - Members Section */
.members-section {
  min-height: 400px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Member Cards */
.member-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Vibrant gradient accents based on interest area */
.member-card.pastel-blue {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #ffffff 0%, #dbeafe 50%, #bfdbfe 100%);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.member-card.pastel-green {
  border-color: #34d399;
  background: linear-gradient(135deg, #ffffff 0%, #d1fae5 50%, #a7f3d0 100%);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.member-card.pastel-pink {
  border-color: #f472b6;
  background: linear-gradient(135deg, #ffffff 0%, #fce7f3 50%, #fbcfe8 100%);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);
}

.member-card.pastel-purple {
  border-color: #a78bfa;
  background: linear-gradient(135deg, #ffffff 0%, #ede9fe 50%, #ddd6fe 100%);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}

.member-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-content {
  flex: 1;
}

.card-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1e293b;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
}

.card-location {
  font-size: 13px;
  color: #888;
  margin: 0 0 16px 0;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.interest-tag {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s;
}

.interest-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.view-profile-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.view-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: #666;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.empty-hint {
  font-size: 14px;
  color: #888;
}

/* Profile Detail Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.modal-close:hover {
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.profile-detail {
  padding: 40px;
}

.profile-name {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-title {
  font-size: 16px;
  color: #666;
  margin: 0 0 6px 0;
}

.profile-location {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px 0;
}

.profile-interests {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-bio {
  margin-bottom: 24px;
}

.profile-bio p {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .community-layout {
    grid-template-columns: 200px 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .community-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .refine-panel {
    position: static;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 28px;
  }

  .profile-detail {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .community-header {
    padding: 32px 20px 24px;
  }

  .community-layout {
    padding: 0 20px 32px;
  }

  .page-title {
    font-size: 24px;
  }

  .profile-name {
    font-size: 24px;
  }
}
`;

// Filter Bar Component
function FilterBar({ filters, setFilters }) {
  return (
    <div className="refine-panel">
      <h2 className="refine-title">Refine</h2>
      
      <div className="filter-group">
        <label className="filter-label">Location</label>
        <select
          className="filter-select"
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="">All locations</option>
          <option value="Thrissur">Thrissur</option>
          <option value="Kochi">Kochi</option>
          <option value="Calicut">Calicut</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Interest Area</label>
        <select
          className="filter-select"
          value={filters.interest}
          onChange={e => setFilters({ ...filters, interest: e.target.value })}
        >
          <option value="">All interests</option>
          <option value="Education">Education</option>
          <option value="Environment">Environment</option>
          <option value="Health">Health</option>
          <option value="Caregiving">Caregiving</option>
        </select>
      </div>
    </div>
  );
}

// Profile Card Component
function ProfileCard({ user, onView }) {
  const interestColors = {
    Education: "pastel-blue",
    Environment: "pastel-green",
    Health: "pastel-pink",
    Caregiving: "pastel-purple"
  };

  const primaryInterest = user.interests?.[0] || "Education";
  const colorClass = interestColors[primaryInterest] || "pastel-blue";

  return (
    <div className={`member-card ${colorClass}`}>
      <div className="card-content">
        <h3 className="card-name">{user.name}</h3>
        <p className="card-title">{user.title}</p>
        <p className="card-location">{user.location}</p>

        {user.interests && user.interests.length > 0 && (
          <div className="interest-tags">
            {user.interests.map(interest => (
              <span key={interest} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="view-profile-btn" onClick={() => onView(user)}>
        View profile
      </button>
    </div>
  );
}

// Profile Detail Modal Component
function ProfileDetail({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="profile-detail">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-title">{user.title}</p>
          <p className="profile-location">📍 {user.location}</p>

          {user.interests && user.interests.length > 0 && (
            <div className="profile-interests">
              <h3 className="section-title">Interest Areas</h3>
              <div className="interest-tags">
                {user.interests.map(interest => (
                  <span key={interest} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.bio && (
            <div className="profile-bio">
              <h3 className="section-title">About</h3>
              <p>{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Community Page Component
export default function CommunityPage() {
  // Inject styles
  if (typeof document !== 'undefined') {
    const styleId = 'community-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }
  const [filters, setFilters] = useState({
    location: "",
    interest: ""
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const visibleUsers = mockUsers
    .filter(u => u.isCommunityVisible)
    .filter(u =>
      (!filters.location || u.location === filters.location) &&
      (!filters.interest || u.interests?.includes(filters.interest))
    );

  return (
    <div className="community-page">
      {/* Header Section */}
      <header className="community-header">
        <h1 className="page-title">Community</h1>
        <p className="page-description">
          Discover people doing meaningful work. Connect with intention.
        </p>
        <p className="member-count">{visibleUsers.length} members visible</p>
      </header>

      {/* Two Column Layout */}
      <div className="community-layout">
        {/* Left Column - Refine Panel */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Right Column - Members Grid */}
        <div className="members-section">
          {visibleUsers.length === 0 ? (
            <div className="empty-state">
              <p>No members match your current filters.</p>
              <p className="empty-hint">Try adjusting your criteria to see more community members.</p>
            </div>
          ) : (
            <div className="members-grid">
              {visibleUsers.map(user => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  onView={setSelectedUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedUser && (
        <ProfileDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}