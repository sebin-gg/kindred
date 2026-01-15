import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav style={{
      padding: '15px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{
        margin: '0 15px',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s'
      }}>Home</Link>
      <Link to="/profile" style={{
        margin: '0 15px',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s'
      }}>Profile Settings</Link>
      <Link to="/community" style={{
        margin: '0 15px',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s'
      }}>Community</Link>
      <Link to="/hero-space" style={{
        margin: '0 15px',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s'
      }}>My Hero Space</Link>
      <Link to="/hero-journal" style={{
        margin: '0 15px',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s'
      }}>Hero Journal</Link>
    </nav>
  );
}