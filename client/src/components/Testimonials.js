import React, { useState, useEffect } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'PhD Candidate, Stanford',
    avatar: 'SJ',
    content: 'EssayAI has been a game-changer for my research papers. The AI understands context perfectly and generates well-cited, academic-grade content.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Undergrad, MIT',
    avatar: 'MC',
    content: 'I went from struggling with essays to getting A\'s consistently. The outline generator alone saved me countless hours of brainstorming.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'High School Senior',
    avatar: 'ER',
    content: 'My college application essays turned out amazing. The paraphraser helped me find the perfect way to express my experiences.',
    rating: 5,
  },
  {
    name: 'Dr. James Wilson',
    role: 'Professor, UC Berkeley',
    avatar: 'JW',
    content: 'I recommend EssayAI to my students. It teaches proper essay structure while helping them articulate their ideas more clearly.',
    rating: 4,
  },
  {
    name: 'Priya Patel',
    role: 'Graduate Researcher',
    avatar: 'PP',
    content: 'The citation generator is flawless. It handles APA, MLA, and Chicago perfectly. A must-have tool for any academic writer.',
    rating: 5,
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className="testimonials-section reveal">
      <div className="container">
        <div className="section-label">Testimonials</div>
        <h2>What Our Users Say</h2>
        <p className="section-desc">Join thousands of satisfied writers worldwide</p>
        <div
          className="testimonials-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="testimonials-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <FiStar key={si} className={si < t.rating ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <p className="testimonial-content">"{t.content}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="testimonial-arrow testimonial-arrow-left" onClick={prev}><FiChevronLeft /></button>
          <button className="testimonial-arrow testimonial-arrow-right" onClick={next}><FiChevronRight /></button>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`testimonial-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
