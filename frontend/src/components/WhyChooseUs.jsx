import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  return (
    <section className="why-section" id="why-us">
      <div className="why-container">
        
        {/* Added Main Heading */}
        <div className="section-header">
          <h1 className="serif main-title">Why Choose Us</h1>
        </div>

        {/* FEATURE 1: AI Proofreading */}
        <div className="why-row">
          <div className="why-visual">
            <div className="preview-card doc-preview">
              <div className="skeleton-doc">
                <div className="highlight-box">
                  <span className="dot red"></span>
                  <p className="jargon">"Indentification shall be unlimited..."</p>
                  <div className="ai-suggestion">
                    <p>High Risk detected: Unlimited liability is unfavorable.</p>
                    <span className="suggestion-btn">Cap Liability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="why-text">
            <h2 className="serif">Leave legal auditing to AI tech</h2>
            <p>Our built-in checker keeps unfavorable clauses, hidden traps, and legal jargon under control.</p>
            <ul className="check-list">
              <li><span>✓</span> Automated risk and liability analysis</li>
              <li><span>✓</span> Hidden trap and "Fine Print" elimination</li>
              <li><span>✓</span> Smart suggestions tailored to your jurisdiction</li>
            </ul>
          </div>
        </div>

        {/* FEATURE 2: Plain Language Translation (Reversed) */}
        <div className="why-row reverse">
          <div className="why-visual">
            <div className="preview-card toggle-preview">
              <div className="toggle-list">
                <div className="toggle-item">Simplify Language <span className="toggle on"></span></div>
                <div className="toggle-item">Identify Risks <span className="toggle on"></span></div>
                <div className="toggle-item">Extract Dates <span className="toggle off"></span></div>
                <div className="toggle-item">Check Compliance <span className="toggle on"></span></div>
              </div>
            </div>
          </div>
          <div className="why-text">
            <h2 className="serif">Translate jargon in one click</h2>
            <p>Paste the complex clause—our assistant does the rest. In seconds, it updates the text to plain, actionable English.</p>
            <ul className="check-list">
              <li><span>✓</span> Clause-by-clause simplification</li>
              <li><span>✓</span> Plain language summary generation</li>
              <li><span>✓</span> Critical date and milestone extraction</li>
              <li><span>✓</span> Termination right transparency</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;