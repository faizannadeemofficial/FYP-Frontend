import React from 'react';

const ModerationCategories = ({ imageDetections = [] }) => {
  // Build categories from imageDetections
  // Each detection: { second, harmful_detected: ["Violence", ...], isFlagged }
  // Flatten all harmful_detected and group by category
  const categoryMap = {};
  imageDetections.forEach(det => {
    if (Array.isArray(det.harmful_detected)) {
      det.harmful_detected.forEach(cat => {
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push(det.second);
      });
    }
  });
  const categories = Object.keys(categoryMap).map(cat => ({
    name: cat,
    times: categoryMap[cat]
  }));

  const categoryContainerStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
    }

  const tagContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const tagStyle = {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  };

  const tooltipStyle = {
    position: 'absolute',
    top: '-35px', // Position above the tag
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(50, 50, 50, 0.9)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 10,
  };

  const tooltipArrowStyle = {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'rgba(50, 50, 50, 0.9) transparent transparent transparent',
  };


  // State to manage which tag's tooltip is visible
  const [hoveredTag, setHoveredTag] = React.useState(null);

  return (
    <div style={categoryContainerStyle}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Detected Categories</div>
      <div style={tagContainerStyle}>
        {categories.length === 0 ? (
          <span style={{ color: '#ccc', fontSize: 15 }}>No harmful categories detected.</span>
        ) : (
          categories.map((category, index) => (
            <div
              key={index}
              style={{ ...tagStyle, ...(hoveredTag === index ? { background: 'rgba(255, 255, 255, 0.2)' } : {}) }}
              onMouseEnter={() => setHoveredTag(index)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {category.name}
              {hoveredTag === index && (
                <div style={{...tooltipStyle, opacity: 1}}>
                  Seconds: {category.times.join(', ')}
                  <div style={tooltipArrowStyle} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModerationCategories;