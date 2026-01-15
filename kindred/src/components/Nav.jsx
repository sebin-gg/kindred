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

  return (
    <nav style={{
      padding: '15px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{
          margin: '0 15px',
          color: '#000',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'color 0.3s'
        }}>Home</Link>
        {token && (
          <>
            <Link to="/profile" style={{
              margin: '0 15px',
              color: '#000',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'color 0.3s'
            }}>Profile Settings</Link>
            <Link to="/community" style={{
              margin: '0 15px',
              color: '#000',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'color 0.3s'
            }}>Community</Link>
            <Link to="/hero-space" style={{
              margin: '0 15px',
              color: '#000',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'color 0.3s'
            }}>My Hero Space</Link>
            <Link to="/hero-journal" style={{
              margin: '0 15px',
              color: '#000',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'color 0.3s'
            }}>Hero Journal</Link>
          </>
        )}
      </div>
      {token && (
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}