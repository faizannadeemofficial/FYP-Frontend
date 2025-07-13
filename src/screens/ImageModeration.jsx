import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModerationCategories from '../components/ModerationCategories';

const ImageModerationOutput = () => {
    const location = useLocation();
    const {
        bluredImagePath = '',
        harmfulDetected = [],
        projectName = 'untitled_project055',
        imageUrl = '',
    } = location.state || {};

    // Build processed image URL from API
    const processedImageUrl = bluredImagePath
        ? `http://localhost:5000/stream/${bluredImagePath}`
        : imageUrl || 'https://images.unsplash.com/photo-1741175363663-b83a99e37685?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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


                {/* Moderated Text & Video Split */}
                <div style={{ display: 'flex', gap: 24, marginTop: 0 }}>
                    {/* Left: Image Only */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                        minWidth: 0
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '40px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px'
                        }}>
                            <img
                                src={processedImageUrl}
                                alt="Processed Moderated Image"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '350px',
                                    borderRadius: '10px',
                                    marginBottom: '18px'
                                }}
                            />
                        </div>
                    </div>
                    {/* Right: Moderated Video and Stats */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                        minWidth: 0
                    }}>
                        {/* Slider removed as requested */}
                        {/* Tags Section */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '20px 24px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            marginTop: '0',
                            minHeight: '90px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '12px 16px',
                                alignItems: 'flex-start',
                            }}>
                                {harmfulDetected && harmfulDetected.length > 0 ? (
                                    harmfulDetected.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                background: 'rgba(60, 65, 90, 0.95)',
                                                color: '#fff',
                                                borderRadius: '10px',
                                                padding: '8px 18px',
                                                fontSize: '15px',
                                                fontWeight: 500,
                                                textAlign: 'center',
                                                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                marginBottom: 0,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: '#fff', opacity: 0.6, fontSize: '15px' }}>No harmful content detected.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModerationOutput;