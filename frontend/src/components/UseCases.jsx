import React from 'react';
import './UseCases.css';

const UseCases = () => {
  const cases = [
    {
      title: "For Students",
      description: "Review internship offers and apartment leases. Understand your rights before you sign your first big commitment.",
      tag: "Career & Housing"
    },
    {
      title: "For Freelancers",
      description: "Ensure you own your intellectual property and have clear payment milestones. Avoid 'scope creep' automatically.",
      tag: "Business Protection"
    },
    {
      title: "For Startups",
      description: "Audit NDAs and Service Agreements in seconds. Save thousands on initial legal reviews with AI-powered auditing.",
      tag: "Scale Safely"
    }
  ];

  return (
    <section className="use-container">
      <div className="use-header">
        <h1 className="serif">How Contractify helps Modern People</h1>
      </div>

      <div className="use-grid">
        {cases.map((item, index) => (
          <div className="use-card" key={index}>
            <div className="use-tag">{item.tag}</div>
            <h3 className="serif">{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UseCases;