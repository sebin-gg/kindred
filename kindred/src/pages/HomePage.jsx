import React from 'react';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <PageHeader title="Welcome to Kindred" description="Connect with your community and track your impact." />
      <div style={{
        marginTop: '3rem',
        maxWidth: '800px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '1.5rem' }}>Explore the features:</h2>
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
              color: '#fff',
              fontSize: '18px',
              padding: '1rem',
              display: 'block',
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
              padding: '1rem',
              display: 'block',
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
              padding: '1rem',
              display: 'block',
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
              padding: '1rem',
              display: 'block',
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