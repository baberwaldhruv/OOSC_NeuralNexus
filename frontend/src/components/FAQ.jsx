import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      q: "Is my data and contract private?",
      a: "Absolutely. We use zero-data retention logic. Your files are processed in encrypted memory and permanently deleted the second your session ends."
    },
    {
      q: "Can Contractify replace a real lawyer?",
      a: "No. Contractify is an AI assistant designed to help you understand jargon and spot risks. For high-stakes litigation or final signing, we always recommend professional legal counsel."
    },
    {
      q: "What file formats do you support?",
      a: "Currently, we support PDF files as they are the industry standard for finalized contracts. DOCX support is coming soon."
    },
    {
      q: "How accurate is the AI Risk Score?",
      a: "Our model is trained on thousands of legal precedents. While it is highly accurate at spotting common 'red flag' clauses, it should be used as a guide, not an absolute legal truth."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <span className="latte-tag">Support</span>
          <h2 className="serif">Common Questions</h2>
        </div>

        <div className="faq-list">
          {questions.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{item.q}</h3>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;