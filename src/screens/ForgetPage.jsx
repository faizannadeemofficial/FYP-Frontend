import React, { useState } from 'react';

const ForgetPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/send_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to_email: email,
          subject: "Password Reset OTP",
          text: "Your OTP for password reset. Please use this code to reset your password."
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccess('OTP has been sent to your email!');
          setStep(2);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to_email: email,
          otp: otp,
          new_password: newPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccess('Password updated successfully! You can now login with your new password.');
          // Optional: Redirect to login page after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          setError('Failed to update password. Please try again.');
        }
      } else {
        const errData = await response.json();
        setError(errData.message || 'Invalid OTP or failed to update password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
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
          {step === 1 ? 'Forgot Password?' : 'Reset Password'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />

            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '14px',
              margin: '0'
            }}>
              We'll send you an OTP to reset your password
            </p>

            {error && <p style={{ color: '#ff6b6b', fontSize: '14px', margin: '10px 0 0' }}>{error}</p>}
            {success && <p style={{ color: '#4caf50', fontSize: '14px', margin: '10px 0 0' }}>{success}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: loading ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '10px',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '14px',
              margin: '0 0 10px 0'
            }}>
              Enter the OTP sent to: {email}
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.toUpperCase())}
              maxLength="6"
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '2px'
              }}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />

            {error && <p style={{ color: '#ff6b6b', fontSize: '14px', margin: '10px 0 0' }}>{error}</p>}
            {success && <p style={{ color: '#4caf50', fontSize: '14px', margin: '10px 0 0' }}>{success}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: loading ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '10px',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPage;