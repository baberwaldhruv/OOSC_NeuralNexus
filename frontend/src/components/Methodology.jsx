import React from 'react';
import './Methodology.css';

const Methodology = () => {
  const steps = [
    {
      number: "01",
      title: "Text Extraction",
      desc: "The system extracts textual content from uploaded documents using advanced document processing libraries.",
      icon: "📄"
    },
    {
      number: "02",
      title: "Clause Segregation",
      desc: "Extracted text is divided into individual sections, enabling a granular, detailed analysis of every contract part.",
      icon: "✂️"
    },
    {
      number: "03",
      title: "AI-Based Analysis",
      desc: "NLP and LLMs analyze clauses to identify legal terms, obligations, payment conditions, and termination rules.",
      icon: "🧠"
    },
    {
      number: "04",
      title: "Risk Detection",
      desc: "The system flags potentially unfavorable clauses that may expose you to legal or financial disadvantages.",
      icon: "🚩"
    },
    {
      number: "05",
      title: "Plain Language Explanation",
      desc: "Complex legal terminology is translated into simple, easy-to-understand explanations for total clarity.",
      icon: "💡"
    }
  ];

  return (
    <section className="meth-container" id="methodology">
      <div className="meth-header">
        <h1 className="serif">How It Works</h1>
        <p className="meth-intro">Contractify transforms complex legal language into actionable insights.</p>
      </div>

      <div className="meth-list">
        {steps.map((step, index) => (
          <div className="meth-item" key={index}>
            <div className="meth-number-line">
              <span className="meth-number">{step.number}</span>
              {index !== steps.length - 1 && <div className="line-connector"></div>}
            </div>
            <div className="meth-content-card">
              <div className="meth-card-icon">{step.icon}</div>
              <div className="meth-text">
                <h3 className="serif">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="meth-cta">
        <p>Still have questions?</p>
        <button className="btn-consult-simple">Connect with a Legal Expert</button>
      </div>
    </section>
  );
};

export default Methodology;