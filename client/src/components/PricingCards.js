import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started',
    features: ['5 essays per month', 'Basic AI writing', 'Grammar check', 'Summarizer tool', 'Email support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    desc: 'For serious writers',
    features: ['100 essays per month', 'Advanced AI writing', 'All 7 AI tools', 'Priority support', 'Citation generator', 'Plagiarism check'],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '$19',
    period: '/month',
    desc: 'For professionals & teams',
    features: ['Unlimited essays', 'Premium AI model', 'All tools unlimited', 'Team collaboration', 'API access', 'Dedicated support', 'Custom templates'],
    cta: 'Go Premium',
    highlight: false,
  },
];

function PricingCards() {
  return (
    <section className="pricing-section reveal">
      <div className="container">
        <div className="section-label">Pricing</div>
        <h2>Simple, Transparent Pricing</h2>
        <p className="section-desc">Choose the plan that fits your writing needs</p>
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div className={`pricing-card ${plan.highlight ? 'pricing-highlight' : ''}`} key={i}>
              {plan.highlight && <div className="pricing-popular">Most Popular</div>}
              <div className="pricing-header">
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <p>{plan.desc}</p>
              </div>
              <ul className="pricing-features">
                {plan.features.map((f, fi) => (
                  <li key={fi}><FiCheck /> {f}</li>
                ))}
              </ul>
              <Link to="/register" className={`pricing-cta ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                {plan.cta} <FiArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingCards;
