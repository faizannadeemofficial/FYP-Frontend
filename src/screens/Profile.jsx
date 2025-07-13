

const Profile = () => {
  let user = null;
  let auth_token = '';
  let refresh_token = '';
  try {
    user = JSON.parse(localStorage.getItem('user'));
    auth_token = localStorage.getItem('auth_token') || '';
    refresh_token = localStorage.getItem('refresh_token') || '';
  } catch {
    user = null;
  }
  const initial = user && user.user_name ? user.user_name.charAt(0).toUpperCase() : '?';

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Emoji", "Apple Color Emoji", "Segoe UI", Roboto, Arial, sans-serif',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Back Button */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 0 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            color: '#fff',
            fontWeight: 500,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 4 }}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '40px',
        width: '100%',
        maxWidth: '900px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '24px',
        boxShadow: '0 4px 32px rgba(44,62,80,0.10)',
        padding: '40px 24px',
        marginTop: 32,
        border: '1.5px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(16px)',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {/* Left Pane: User Badge & Info */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1.5px solid rgba(255,255,255,0.10)',
          paddingRight: '32px',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(44,62,80,0.10)'
          }}>{initial}</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{user?.user_name || '-'}</div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>User ID: <span style={{ color: '#fff', fontWeight: 500 }}>{user?.user_id || '-'}</span></div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>Email: <span style={{ color: '#fff', fontWeight: 500 }}>{user?.email_id || '-'}</span></div>
        </div>
        {/* Right Pane: Tokens */}
        <div style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '32px',
          paddingLeft: '32px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.09)',
            borderRadius: '16px',
            padding: '20px 20px 18px 20px',
            marginBottom: '16px',
            wordBreak: 'break-all',
            border: '1.5px solid rgba(255,255,255,0.10)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 16, color: '#7ed6df' }}>Auth Token</span>
              <button
                onClick={() => handleCopy(auth_token)}
                title="Copy Auth Token"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: 8,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#7ed6df',
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                }}
              >
                <svg width="20" height="20" fill="none" stroke="#7ed6df" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
              </button>
            </div>
            <div style={{ fontSize: 15, color: '#fff', opacity: 0.95 }}>{auth_token || '-'}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.09)',
            borderRadius: '16px',
            padding: '20px 20px 18px 20px',
            wordBreak: 'break-all',
            border: '1.5px solid rgba(255,255,255,0.10)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 16, color: '#7ed6df' }}>Refresh Token</span>
              <button
                onClick={() => handleCopy(refresh_token)}
                title="Copy Refresh Token"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: 8,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#7ed6df',
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                }}
              >
                <svg width="20" height="20" fill="none" stroke="#7ed6df" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
              </button>
            </div>
            <div style={{ fontSize: 15, color: '#fff', opacity: 0.95 }}>{refresh_token || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;