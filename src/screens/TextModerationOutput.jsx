
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';


const TextModerationOutput = () => {
  const location = useLocation();
  const {
    totalWords = 0,
    profaneWords = 0,
    moderationData = null,
    projectName = 'untitled_project01'
  } = location.state || {};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Emoji", "Apple Color Emoji", "Segoe UI", Roboto, Arial, sans-serif',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <ArrowLeft 
            size={24} 
            style={{ cursor: 'pointer', opacity: 0.7 }}
            onClick={() => window.history.back()}
          />
          <h1 style={{
            fontSize: '20px',
            fontWeight: '400',
            margin: 0,
            opacity: 0.9
          }}>
            {projectName}
          </h1>
        </div>
        
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23666\'/%3E%3Ctext x=\'50\' y=\'55\' text-anchor=\'middle\' fill=\'white\' font-size=\'30\' font-family=\'Arial\'%3E👤%3C/text%3E%3C/svg%3E") center/cover',
          backgroundSize: 'cover'
        }}>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Total Words Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '600',
              lineHeight: '1',
              marginBottom: '10px'
            }}>
              {totalWords}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Total words
            </div>
          </div>

          {/* Profane Words Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '600',
              lineHeight: '1',
              marginBottom: '10px'
            }}>
              {profaneWords}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Profane words
            </div>
          </div>
        </div>

        {/* Moderated Text Display */}
        {/* Copy Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button
            onClick={() => {
              if (Array.isArray(moderationData)) {
                const text = moderationData.map(item => item.FilteredWord).join(' ');
                navigator.clipboard.writeText(text);
              }
            }}
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              padding: '8px',
              fontSize: '22px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
            }}
            onMouseDown={e => e.preventDefault()}
            title="Copy moderated text"
            aria-label="Copy moderated text"
          >
            <Copy size={22} color="#fff" style={{ pointerEvents: 'none' }} />
          </button>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          lineHeight: '1.6'
        }}>
          <div style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Emoji", "Apple Color Emoji", "Segoe UI", Roboto, Arial, sans-serif',
          }}>
            <style>{`
              .tm-profane-word .tm-tooltip {
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.2s;
              }
              .tm-profane-word:hover .tm-tooltip {
                visibility: visible;
                opacity: 1;
              }
            `}</style>
            {Array.isArray(moderationData)
              ? moderationData.map((item, idx) =>
                  item.IsProfane ? (
                    <span
                      key={idx}
                      className="tm-profane-word"
                      style={{
                        color: '#e75480', // vivid pink
                        fontWeight: 700,
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        padding: '2px 8px',
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'inline-block',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                      }}
                    >
                      <span
                        className="tm-tooltip"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '-32px',
                          transform: 'translateX(-50%)',
                          background: '#222',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '15px',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          pointerEvents: 'none',
                        }}
                      >
                        {item.OriginalWord}
                      </span>
                      {item.FilteredWord}
                    </span>
                  ) : (
                    <span key={idx}>{item.FilteredWord}</span>
                  )
                )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextModerationOutput;