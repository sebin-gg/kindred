import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Nav() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkBaseStyle = {
    margin: '0 12px',
    color: '#f9fafb',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    transition: 'color 0.2s, transform 0.2s',
  };

  return (
    <nav style={{
      padding: '12px 20px',
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #111827 100%)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.9)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link
          to="/"
          style={linkBaseStyle}
          title="Go back to your Kindred home"
        >
          Home
        </Link>
        {token && (
          <>
            <Link
              to="/profile"
              style={linkBaseStyle}
              title="Edit your basic info, bio, interests, and visibility"
            >
              Profile Settings
            </Link>
            <Link
              to="/community"
              style={linkBaseStyle}
              title="Discover other people and their interest areas"
            >
              Community
            </Link>
            <Link
              to="/hero-space"
              style={linkBaseStyle}
              title="See your tracks, points, and current title"
            >
              My Hero Space
            </Link>
            <Link
              to="/hero-journal"
              style={linkBaseStyle}
              title="Log new actions and grow your impact"
            >
              Hero Journal
            </Link>
          </>
        )}
      </div>
      {token && (
        <>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #f97373 0%, #fb7185 100%)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            Logout
          </button>
          {/* Global floating action button for adding a new journal entry */}
          <Link
            to="/hero-journal"
            title="Add a new action to your Hero Journal"
            style={{
              position: 'fixed',
              right: '24px',
              bottom: '24px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f9fafb',
              fontSize: '30px',
              textDecoration: 'none',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.55)',
              zIndex: 1200,
            }}
          >
            +
          </Link>
        </>
      )}
    </nav>
  );
}