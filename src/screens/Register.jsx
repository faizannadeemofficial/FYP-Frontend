import { useState } from 'react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: name,
          email_id: email,
          password: password
        })
      });
      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Registration failed.');
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
          Create Account
        </h2>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {success && <p style={{ color: '#4BB543', fontSize: '14px', margin: '10px 0 0' }}>{success}</p>}

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
            Register
          </button>
        </form>

        <p style={{ fontSize: '14px', marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#2575fc', textDecoration: 'none', fontWeight: '500' }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
