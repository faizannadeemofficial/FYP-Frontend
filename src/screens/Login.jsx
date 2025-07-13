import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_id: email,
          password: password
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Store tokens and user info in localStorage
        localStorage.setItem('auth_token', data.auth_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard or home
        window.location.href = '/';
      } else {
        const errData = await response.json();
        setError(errData.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '30px',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              '::placeholder': {
                color: 'rgba(255, 255, 255, 0.6)'
              }
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              '::placeholder': {
                color: 'rgba(255, 255, 255, 0.6)'
              }
            }}
          />

          {error && <p style={{ color: '#ff6b6b', fontSize: '14px', margin: '10px 0 0' }}>{error}</p>}

          <button
            type="submit"
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            Login
          </button>
        </form>

        <p style={{ fontSize: '14px', marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#2575fc', textDecoration: 'none', fontWeight: '500' }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
