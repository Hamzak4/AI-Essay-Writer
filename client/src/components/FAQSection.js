import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    q: 'How does the AI essay writer work?',
    a: 'Our AI uses Google Gemini to generate high-quality essays based on your topic, tone, and length requirements. Simply enter your topic, choose your preferences, and the AI will produce a well-structured essay in seconds.',
  },
  {
    q: 'Is the content original and plagiarism-free?',
    a: 'Yes! Each essay is generated uniquely based on your inputs. The AI creates original content every time, though we recommend reviewing and personalizing the output to ensure it matches your voice.',
  },
  {
    q: 'Can I use EssayAI for academic papers?',
    a: 'Absolutely. Our tool is designed to help with academic writing including research papers, essays, and reports. It supports formal tones and proper citation formats.',
  },
  {
    q: 'What citation formats are supported?',
    a: 'Our citation generator supports APA (7th edition), MLA (9th edition), and Chicago Manual of Style. You can generate citations for books, articles, websites, and more.',
  },
  {
    q: 'Is there a free plan available?',
    a: 'Yes! Our Free plan lets you generate up to 5 essays per month with access to basic writing tools. No credit card required to get started.',
  },
  {
    q: 'How does the paraphrasing tool work?',
    a: 'The paraphraser rewrites your text while preserving the original meaning. You can choose from different styles including academic, casual, professional, and more.',
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section reveal">
      <div className="container">
        <div className="section-label">FAQ</div>
        <h2>Frequently Asked Questions</h2>
        <p className="section-desc">Everything you need to know about EssayAI</p>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className={`faq-item ${openIndex === i ? 'open' : ''}`} key={i}>
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span>{faq.q}</span>
                <FiChevronDown className={`faq-chevron ${openIndex === i ? 'open' : ''}`} />
              </button>
              <div className="faq-answer" style={{ maxHeight: openIndex === i ? '300px' : '0' }}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
