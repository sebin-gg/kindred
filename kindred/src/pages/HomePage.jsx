import React, { useContext } from 'react';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import AuthPage from './AuthPage.jsx';

export default function HomePage() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <AuthPage />;
  }

  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background:
          'radial-gradient(circle at top left, #e0f2fe 0%, transparent 55%), radial-gradient(circle at bottom right, #fee2f2 0%, transparent 55%)',
      }}
    >
      <PageHeader
        title="Kindred"
        description="Connect your everyday actions to the impact they create across your community."
      />
      <p
        style={{
          maxWidth: '720px',
          marginTop: '0.5rem',
          marginBottom: '2rem',
          color: '#111827',
          fontSize: '1rem',
        }}
      >
        Use Kindred to log real-world actions, grow your impact across six tracks, and generate a personal
        title that reflects the causes you care about most.
      </p>
      <div style={{
        marginTop: '1rem',
        maxWidth: '960px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '2.5rem 2.75rem',
        border: '1px solid rgba(148, 163, 184, 0.4)',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
        color: '#000',
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '1.5rem', color: '#0f172a' }}>Explore the features</h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <li>
            <Link to="/profile" style={{
              textDecoration: 'none',
              color: '#000',
              fontSize: '18px',
              padding: '1.1rem 1.4rem',
              display: 'block',
              width: '100%',
              background: 'rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s',
              border: '2px solid rgba(102, 126, 234, 0.5)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.6)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}>
              📝 Profile Settings - Manage your information
            </Link>
          </li>
          <li>
            <Link to="/community" style={{
              textDecoration: 'none',
              color: '#fff',
              fontSize: '18px',
              padding: '1.1rem 1.4rem',
              display: 'block',
              width: '100%',
              background: 'rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(16, 185, 129, 0.6)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(16, 185, 129, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}>
              🌍 Community - Discover like-minded people
            </Link>
          </li>
          <li>
            <Link to="/hero-space" style={{
              textDecoration: 'none',
              color: '#fff',
              fontSize: '18px',
              padding: '1.1rem 1.4rem',
              display: 'block',
              width: '100%',
              background: 'rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s',
              border: '2px solid rgba(245, 158, 11, 0.5)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(245, 158, 11, 0.6)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(245, 158, 11, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}>
              🏆 My Hero Space - Track your achievements
            </Link>
          </li>
          <li>
            <Link to="/hero-journal" style={{
              textDecoration: 'none',
              color: '#fff',
              fontSize: '18px',
              padding: '1.1rem 1.4rem',
              display: 'block',
              width: '100%',
              background: 'rgba(236, 72, 153, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s',
              border: '2px solid rgba(236, 72, 153, 0.5)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(236, 72, 153, 0.6)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(236, 72, 153, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}>
              📖 Hero Journal - Document your actions
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}