import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModerationCategories from '../components/ModerationCategories'; // <-- Import the new component

const MultimediaModerationOutput = () => {
  const location = useLocation();
  const {
    projectName = 'untitled_project055',
    outputPath,
    profanityData,
    audioUrl,
    videoUrl,
    moderatedVideoPath,
    imageDetections,
    textModeratedData
  } = location.state || {};

  // Determine if this is a video result
  const isVideo = !!(moderatedVideoPath || videoUrl);
  const isAudio = !!audioUrl && !isVideo;

  // For video, use textModeratedData for stats; for audio, use profanityData
  const textData = isVideo ? textModeratedData : profanityData;
  const totalWords = Array.isArray(textData) ? textData.length : 0;
  const profaneWords = Array.isArray(textData) ? textData.filter(w => w.IsProfane).length : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
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
        
        {/* <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23666\'/%3E%3Ctext x=\'50\' y=\'55\' text-anchor=\'middle\' fill=\'white\' font-size=\'30\' font-family=\'Arial\'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E") center/cover',
          backgroundSize: 'cover'
        }}>
        </div> */}
      </div>

      {/* Main Content */}
      <div style={{
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>


        {/* Moderated Audio/Video & Results Split */}
        <div style={{ display: 'flex', gap: 24, marginTop: 0 }}>
          {/* Left: Moderation Results */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minWidth: 0
          }}>
            {/* Show ModerationCategories for video, not audio. Pass harmful detections as prop */}
            {/* {isVideo && <ModerationCategories imageDetections={imageDetections} />} */}
            {/* Harmful Detections per for video */}
            {isVideo && Array.isArray(imageDetections) && imageDetections.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '20px 30px',
                marginBottom: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 16,
                fontFamily: 'inherit',
                lineHeight: 1.6
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>Harmful Detections (per second):</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {imageDetections.map((det, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      <span style={{ fontWeight: 500, color: det.isFlagged ? '#ff6b6b' : '#aaa' }}>Second {det.second}:</span>
                      {det.harmful_detected && det.harmful_detected.length > 0 ? (
                        <span style={{ marginLeft: 8, color: '#ffb347' }}>{det.harmful_detected.join(', ')}</span>
                      ) : (
                        <span style={{ marginLeft: 8, color: '#aaa' }}>No harmful content</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Text Moderation Results (for video or audio) */}
            <div style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              lineHeight: '1.6',
              minWidth: 0
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
                {Array.isArray(textData) && textData.length > 0 ?
                  textData.map((item, idx) =>
                    item.IsProfane ? (
                      <span
                        key={idx}
                        className="tm-profane-word"
                        style={{
                          color: '#FFA500',
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
                  : <span style={{ color: '#ccc' }}>No moderation data available.</span>
                }
              </div>
            </div>
          </div>
          {/* Right: Audio/Video Player and Stats */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minWidth: 0
          }}>
            {/* Stats Cards */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 0 }}>
              {/* Total Words Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
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
                backdropFilter: 'blur(10px)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
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
            {/* Moderated Audio/Video */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: isVideo ? 320 : 120
            }}>
              {isVideo ? (
                (moderatedVideoPath || videoUrl) ? (
                  <video
                    src={moderatedVideoPath ? `http://localhost:5000/stream/${moderatedVideoPath.split('/').pop()}` : videoUrl}
                    controls
                    style={{ width: '100%', height: '100%', borderRadius: 12, background: '#222' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <span style={{ color: '#ccc' }}>No video file available.</span>
                )
              ) : outputPath ? (
                <audio
                  src={`http://localhost:5000/stream/${outputPath.split('/').pop()}`}
                  controls
                  style={{ width: '100%', borderRadius: 12, background: '#222' }}
                >
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <span style={{ color: '#ccc' }}>No audio file available.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultimediaModerationOutput;