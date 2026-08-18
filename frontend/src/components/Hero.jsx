import React from 'react';
import './Hero.css';

const Hero = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <section className="hero-container">
      {/* LEFT: Text Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Understand every clause with <span className="highlight-text">Contractify</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered legal analysis, risk detection, and one-click summaries to make your contracts crystal clear.
        </p>
        
        <div className="hero-action-area">
          <label className="btn-cocoa-upload">
            Upload Contract
            <input 
              type="file" 
              className="file-input-hidden" 
              accept=".pdf" 
              onChange={handleFileChange} 
            />
          </label>
        </div>
      </div>

      {/* RIGHT: Floating Document Placeholder */}
      <div className="hero-visual">
        <div className="document-placeholder">
          <div className="floating-paper">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="ai-tag">AI ASSISTANT</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;