
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';
import logo from '../assets/logo.png'; // Adjust the path as necessary

const Dashboard = () => {

    const [records, setRecords] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return;
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);
    useEffect(() => {
        fetch('http://localhost:5000/api/retrieve/', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('auth_token'),
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                // Ensure records is always an array
                setRecords(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                setRecords([]);
                console.error('Error fetching records:', err);
            });
    }, []);

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="logo">
                    <img src={logo} className="logo-image" alt="CensorX Logo" />
                </div>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <div
                        className="profile-pic"
                        style={{
                            background: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.3rem',
                            fontWeight: '400',
                            color: '#fff',
                            backgroundColor: 'rgba(44,62,80,0.8)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            transition: 'box-shadow 0.2s',
                        }}
                        onClick={() => setDropdownOpen(v => !v)}
                        title="Account"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setDropdownOpen(v => !v); }}
                    >
                        {(() => {
                            try {
                                const user = JSON.parse(localStorage.getItem('user'));
                                return user && user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : '?';
                            } catch {
                                return '?';
                            }
                        })()}
                    </div>
                    {dropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '110%',
                                right: 0,
                                minWidth: '120px',
                                background: 'rgba(44,62,80,0.98)',
                                color: '#fff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 16px rgba(44,62,80,0.18)',
                                zIndex: 100,
                                padding: '8px 0',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <button
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '10px 18px',
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    transition: 'background 0.15s',
                                }}
                                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setDropdownOpen(false); navigate('/profile'); } }}
                            >
                                Profile
                            </button>
                            <button
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '10px 18px',
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    transition: 'background 0.15s',
                                }}
                                onClick={async () => {
                                    setDropdownOpen(false);
                                    const refreshToken = localStorage.getItem('refresh_token');
                                    // Remove tokens from localStorage
                                    localStorage.removeItem('auth_token');
                                    localStorage.removeItem('refresh_token');
                                    localStorage.removeItem('user');
                                    // Call logout API if refresh token exists
                                    if (refreshToken) {
                                        try {
                                            await fetch('http://localhost:5000/api/auth/logout', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ refresh_token: refreshToken })
                                            });
                                        } catch (err) {
                                            // Optionally handle error
                                        }
                                    }
                                    navigate('/login');
                                }}
                                onKeyDown={async e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setDropdownOpen(false);
                                        const refreshToken = localStorage.getItem('refresh_token');
                                        localStorage.removeItem('auth_token');
                                        localStorage.removeItem('refresh_token');
                                        localStorage.removeItem('user');
                                        if (refreshToken) {
                                            try {
                                                await fetch('http://localhost:5000/api/auth/logout', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ refresh_token: refreshToken })
                                                });
                                            } catch (err) {}
                                        }
                                        navigate('/login');
                                    }
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="main-content">
                <section className="main-cards">
                    <div className="card" onClick={() => window.location.href = '/text'} style={{ cursor: 'pointer' }}>
                        <div className="card-image text-moderation-img"></div>
                        <div className="card-content">
                            <h3>Text Moderation</h3>
                            <p>Detect and filter offensive words instantly, ensuring clean and professional communication.</p>
                        </div>
                    </div>

                    <div className="card" onClick={() => window.location.href = '/upload'} style={{ cursor: 'pointer' }}>
                        <div className="card-image multimedia-img"></div>
                        <div className="card-content">
                            <h3>Multimedia Moderation</h3>
                            <p>Analyze and censor abusive language in multimedia content for a safer digital experience.</p>
                        </div>
                    </div>
                </section>

                <section className="activities-section">
                    <div className="activities-header">Activities</div>
                    <div className="activities-table">
                        <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 2fr 1fr 1.5fr', alignItems: 'center' }}>
                            <div>#</div>
                            <div>Project Name</div>
                            <div>Input Content</div>
                            <div>Content Type</div>
                            <div style={{ textAlign: 'right', paddingRight: '18px' }}>Modification Date</div>
                        </div>
                        {records.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center' }}>No records found.</div>
                        ) : (
                            records
                              .filter(rec => rec.content_type !== 'TEXT_FILE')
                              .map((rec, idx) => (
                                <div
                                    className="table-row"
                                    key={rec.input_content_id}
                                    style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '40px 1.5fr 2fr 1fr 1.5fr', alignItems: 'center' }}
                                    onClick={async () => {
                                        if (rec.content_type === 'TEXT') {
                                            try {
                                                const response = await fetch('http://localhost:5000/api/retrieve/processed_text', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': localStorage.getItem('auth_token')
                                                    },
                                                    body: JSON.stringify({ input_content_id: [rec.input_content_id] })
                                                });
                                                const data = await response.json();
                                                const moderationData = Array.isArray(data.processed_text)
                                                    ? data.processed_text.map(item => ({
                                                        FilteredWord: item.filtered_word,
                                                        IsProfane: item.is_flagged === 'true',
                                                        OriginalWord: item.original_word,
                                                    }))
                                                    : [];
                                                const totalWords = moderationData.length;
                                                const profaneWords = moderationData.filter(item => item.IsProfane).length;
                                                navigate('/text-output', {
                                                    state: {
                                                        moderationData,
                                                        totalWords,
                                                        profaneWords,
                                                        projectName: rec.project_name,
                                                    }
                                                });
                                            } catch (err) {
                                                alert('Failed to fetch processed text data.');
                                            }
                                        } else if (rec.content_type === 'AUDIO') {
                                            try {
                                                const response = await fetch('http://localhost:5000/api/retrieve/processed_audio', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': localStorage.getItem('auth_token')
                                                    },
                                                    body: JSON.stringify({ input_content_id: rec.input_content_id })
                                                });
                                                const data = await response.json();
                                                const profanityData = Array.isArray(data)
                                                    ? data.map(item => ({
                                                        FilteredWord: item.filtered_word,
                                                        IsProfane: item.is_flagged === 'true',
                                                        OriginalWord: item.original_word,
                                                        startTime: item.start_time,
                                                        endTime: item.end_time
                                                    }))
                                                    : [];
                                                navigate('/multimedia-output', {
                                                    state: {
                                                        projectName: rec.project_name,
                                                        outputPath: rec.output_content, // audio file path
                                                        profanityData,
                                                        ...rec
                                                    }
                                                });
                                            } catch (err) {
                                                alert('Failed to fetch processed audio data.');
                                            }
                                        } else if (rec.content_type === 'VIDEO') {
                                            try {
                                                const response = await fetch('http://localhost:5000/api/retrieve/processed_video', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': localStorage.getItem('auth_token')
                                                    },
                                                    body: JSON.stringify({ input_content_id: rec.input_content_id })
                                                });
                                                const data = await response.json();
                                                const imageDetections = Array.isArray(data.processed_video)
                                                    ? data.processed_video.map((item, idx) => ({
                                                        second: item.start_second,
                                                        harmful_detected: item.video_detections || [],
                                                        isFlagged: Array.isArray(item.video_detections) && item.video_detections.length > 0
                                                    }))
                                                    : [];
                                                const textModeratedData = Array.isArray(data.processed_audio)
                                                    ? data.processed_audio.map(word => ({
                                                        FilteredWord: word.filtered_word,
                                                        IsProfane: word.is_flagged === 'true',
                                                        OriginalWord: word.original_word,
                                                        Start: word.start_time,
                                                        End: word.end_time
                                                    }))
                                                    : [];
                                                navigate('/multimedia-output', {
                                                    state: {
                                                        projectName: rec.project_name,
                                                        moderatedVideoPath: rec.output_content, // video file path
                                                        imageDetections,
                                                        textModeratedData,
                                                        ...rec
                                                    }
                                                });
                                            } catch (err) {
                                                alert('Failed to fetch processed video data.');
                                            }
                                        } else if (rec.content_type === 'IMAGE') {
                                            try {
                                                const response = await fetch('http://localhost:5000/api/retrieve/processed_image', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': localStorage.getItem('auth_token')
                                                    },
                                                    body: JSON.stringify({ input_content_id: rec.input_content_id })
                                                });
                                                const harmfulDetections = await response.json();
                                                navigate('/image-output', {
                                                    state: {
                                                        projectName: rec.project_name,
                                                        bluredImagePath: rec.output_content,
                                                        harmfulDetected: Array.isArray(harmfulDetections) ? harmfulDetections : [],
                                                        imageUrl: rec.input_content,
                                                        ...rec
                                                    }
                                                });
                                            } catch (err) {
                                                alert('Failed to fetch processed image data.');
                                            }
                                        } else {
                                            navigate('/multimedia-output', {
                                                state: {
                                                    projectName: rec.project_name,
                                                    ...rec
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <div className="row-number">{idx + 1}</div>
                                    <div className="project-name">{rec.project_name}</div>
                                    <div className="content-info">
                                        {rec.content_type === 'TEXT' ? (
                                            <span title={rec.input_content}>
                                                {rec.input_content.length > 20
                                                    ? rec.input_content.slice(0, 20) + '...'
                                                    : rec.input_content}
                                            </span>
                                        ) : (
                                            <span>{rec.output_content}</span>
                                        )}
                                    </div>
                                    <div>{rec.content_type}</div>
                                    <div className="modification-date" style={{ textAlign: 'right', paddingRight: '18px' }}>{new Date(rec.modification_date).toLocaleString()}</div>
                                </div>
                              ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;