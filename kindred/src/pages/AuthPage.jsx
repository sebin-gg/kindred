import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/hero-space');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <h1 style={{ color: '#000', textAlign: 'center' }}>
        {isLogin ? 'Login' : 'Register'}
      </h1>

      {error && (
        <div style={{
          background: 'rgba(255, 0, 0, 0.2)',
          color: '#000',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#000', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required={!isLogin}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '5px',
                color: '#000',
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#000', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: '#000',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#000', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: '#000',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#000' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ name: '', email: '', password: '' });
            setError('');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#4facfe',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontWeight: 'bold',
          }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </div>
    </div>
  );
}
