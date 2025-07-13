
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';
import logo from '../assets/logo.png'; // Adjust the path as necessary

const Dashboard = () => {

    const [records, setRecords] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:5000/api/retrieve/', {
            method: 'POST',
            headers: {
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJlbWFpbCI6InRhc2hmZWVuQGdtYWlsLmNvbSIsInVzZXJfbmFtZSI6IlRhc2hmZWVuIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc1MjQ5NzMwMn0.gCjAkCNzrTK5NB6x97wJmznEC96AjfMYDZnYEv6OYi8',
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(data => setRecords(data))
        .catch(err => console.error('Error fetching records:', err));
    }, []);

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="logo">
                    <img src={logo} className="logo-image" alt="CensorX Logo" />
                </div>
                <div className="profile-pic"></div>
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
                        <div className="table-header">
                            <div>#</div>
                            <div>Project Name</div>
                            <div>Content</div>
                            <div>Modification Date</div>
                            <div>Type</div>
                        </div>
                        {records.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center' }}>No records found.</div>
                        ) : (
                            records.map((rec, idx) => (
                                <div
                                    className="table-row"
                                    key={rec.input_content_id}
                                    style={{ cursor: 'pointer' }}
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
                                                        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJlbWFpbCI6InRhc2hmZWVuQGdtYWlsLmNvbSIsInVzZXJfbmFtZSI6IlRhc2hmZWVuIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc1MjQ5NzMwMn0.gCjAkCNzrTK5NB6x97wJmznEC96AjfMYDZnYEv6OYi8'
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
                                                        outputPath: rec.output_content,
                                                        audioUrl: rec.input_content,
                                                        moderatedVideoPath: rec.output_content,
                                                        profanityData,
                                                        ...rec
                                                    }
                                                });
                                            } catch (err) {
                                                alert('Failed to fetch processed audio data.');
                                            }
                                        } else {
                                            navigate('/multimedia-output', {
                                                state: {
                                                    projectName: rec.project_name,
                                                    outputPath: rec.output_content,
                                                    audioUrl: rec.input_content,
                                                    videoUrl: rec.input_content,
                                                    moderatedVideoPath: rec.output_content,
                                                    imageDetections: rec.imageDetections || [],
                                                    textModeratedData: rec.textModeratedData || [],
                                                    profanityData: rec.profanityData || [],
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
                                    <div className="modification-date">{new Date(rec.modification_date).toLocaleString()}</div>
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