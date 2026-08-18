import React from 'react';
import './Dashboard.css';

const Dashboard = ({ fileUrl }) => {
  return (
    <div className="dashboard-container">
      {/* LEFT SIDE: Document Viewer */}
      <div className="doc-viewer">
        <iframe src={fileUrl} title="Contract Viewer" width="100%" height="100%" />
      </div>

      {/* RIGHT SIDE: AI Analysis */}
      <div className="analysis-panel">
        <div className="analysis-header">
          <h2 className="serif">AI Analysis Results</h2>
          <span className="risk-badge high">High Risk Detected</span>
        </div>

        <div className="analysis-scroll">
          <section className="analysis-item">
            <h4>Summary</h4>
            <p>This is a standard employment contract with specific non-compete clauses in Section 4.2.</p>
          </section>

          <section className="analysis-item flagged">
            <h4>🚩 Termination Clause</h4>
            <p><strong>Clause 8.1:</strong> "The company may terminate without notice."</p>
            <div className="ai-explanation">
              <strong>AI Insight:</strong> This is unfavorable. Typically, a 30-day notice period is standard in your jurisdiction.
            </div>
          </section>

          <button className="btn-consult-dash">One-Click Lawyer Consultation</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;