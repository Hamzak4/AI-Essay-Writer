import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiQuillPenLine, RiFileTextLine, RiCheckboxCircleLine, RiMagicLine,
  RiBookmarkLine, RiListUnordered, RiText
} from 'react-icons/ri';
import { FiArrowRight, FiZap, FiShield, FiClock, FiSend, FiStar, FiTrendingUp, FiChevronUp } from 'react-icons/fi';
import Testimonials from '../components/Testimonials';
import PricingCards from '../components/PricingCards';
import FAQSection from '../components/FAQSection';
import BlogFeed from '../components/BlogFeed';
import './Home.css';

const words = ['Essays', 'Research Papers', 'Stories', 'Articles', 'Reports'];

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <strong ref={ref}>{count}{suffix}</strong>;
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickStart = (e) => {
    e.preventDefault();
    navigate('/essay-writer', { state: { topic: topic.trim() } });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tools = [
    { icon: <RiQuillPenLine />, title: 'Essay Writer', desc: 'Generate full essays on any topic', color: '#6366f1', route: '/essay-writer' },
    { icon: <RiMagicLine />, title: 'Paraphraser', desc: 'Rewrite text in different styles', color: '#8b5cf6', route: '/paraphraser' },
    { icon: <RiCheckboxCircleLine />, title: 'Grammar Check', desc: 'Fix grammar and spelling errors', color: '#10b981', route: '/grammar-checker' },
    { icon: <RiFileTextLine />, title: 'Summarizer', desc: 'Condense long texts instantly', color: '#f59e0b', route: '/summarizer' },
    { icon: <RiBookmarkLine />, title: 'Citation Generator', desc: 'APA, MLA, Chicago formats', color: '#06b6d4', route: '/citation-generator' },
    { icon: <RiListUnordered />, title: 'Outline Generator', desc: 'Structure your ideas', color: '#ec4899', route: '/outline-generator' },
    { icon: <RiText />, title: 'Title Generator', desc: 'Catchy essay titles', color: '#f97316', route: '/title-generator' },
  ];

  const features = [
    { icon: <FiZap />, title: 'Lightning Fast', desc: 'Generate essays in seconds with advanced AI', gradient: 'var(--gradient-1)' },
    { icon: <FiShield />, title: 'High Quality', desc: 'Academic-grade content with proper structure', gradient: 'var(--gradient-2)' },
    { icon: <FiClock />, title: 'Save Time', desc: 'Focus on ideas while AI handles the writing', gradient: 'var(--gradient-3)' },
    { icon: <FiTrendingUp />, title: 'Multiple Tools', desc: '7 AI-powered tools for all your writing needs', gradient: 'var(--gradient-1)' },
  ];

  const highlights = [
    { icon: <FiZap />, stat: '10+', label: 'AI Writing Tools' },
    { icon: <FiStar />, stat: '50K+', label: 'Essays Generated' },
    { icon: <FiTrendingUp />, stat: '99%', label: 'Satisfaction Rate' },
    { icon: <FiShield />, stat: '24/7', label: 'AI-Powered Support' },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-grid"></div>
        <div className="hero-floating-orbs">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <FiZap size={12} /> Powered by Google Gemini AI
            </div>
            <h1>
              Write Better<br />
              <span className="type-wrap">
                <span className="type-text">{words[wordIndex]}</span>
                <span className="type-cursor">|</span>
              </span>
              <span className="hero-gradient-text"> 10x Faster</span>
            </h1>
            <p>Transform your ideas into well-structured, engaging essays with the power of AI. From research papers to creative writing — we've got you covered.</p>
            {user && (
              <div className="hero-logged-in-banner fade-in">
                <FiStar className="banner-star" />
                <span>Welcome back, <strong>{user.name?.split(' ')[0] || 'Writer'}</strong>! Ready to continue writing?</span>
              </div>
            )}
            <div className="hero-actions">
              <Link to="/essay-writer" className="btn-primary hero-btn pulse-glow">
                {user ? 'Write an Essay' : 'Start Writing Free'} <FiArrowRight />
              </Link>
              <Link to={user ? '/dashboard' : '/login'} className="btn-secondary hero-btn">
                {user ? 'Go to Dashboard' : 'Sign In'}
              </Link>
            </div>
            <form className="ai-run-bar" onSubmit={handleQuickStart}>
              <FiSend className="run-bar-icon" />
              <input
                type="text"
                className="run-bar-input"
                placeholder="Enter your essay topic and press Enter..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                autoFocus
              />
              <button type="submit" className="run-bar-btn" aria-label="Generate essay">
                <FiArrowRight />
              </button>
            </form>
            <div className="hero-stats">
              <div className="stat fade-in" style={{ animationDelay: '0s' }}>
                <CountUp end={10} suffix="+" />
                <span>AI Tools</span>
              </div>
              <div className="stat fade-in" style={{ animationDelay: '0.15s' }}>
                <CountUp end={50} suffix="K+" />
                <span>Essays Generated</span>
              </div>
              <div className="stat fade-in" style={{ animationDelay: '0.3s' }}>
                <CountUp end={99} suffix="%" />
                <span>Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="highlights-section reveal">
        <div className="container">
          <div className="section-label">Why EssayAI</div>
          <p className="section-desc">Trusted by thousands of students and professionals worldwide</p>
          <div className="highlights-grid">
            {highlights.map((h, i) => (
              <div className="highlight-item card-glass-strong" key={i}>
                <div className="highlight-icon">{h.icon}</div>
                <strong className="highlight-stat">{h.stat}</strong>
                <span className="highlight-label">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tools-section reveal">
        <div className="container">
          <div className="section-label">AI Tools</div>
          <h2>Powerful Writing Suite</h2>
          <p className="section-desc">Everything you need to write perfect essays and more</p>
          <div className="tools-grid">
            {tools.map((tool, i) => (
              <Link to={tool.route} className="tool-card card card-gradient-border" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="tool-icon-wrap" style={{ background: `${tool.color}18`, color: tool.color }}>
                  {tool.icon}
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <div className="tool-card-footer">
                  <span className="tool-cta">Use Tool <FiArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section reveal">
        <div className="container">
          <div className="section-label">Why EssayAI</div>
          <h2>Built for Writers, Powered by AI</h2>
          <p className="section-desc">Thousands of students and professionals trust EssayAI</p>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div className="feature-card card-glass-strong" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon" style={{ background: feature.gradient }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {!user && <PricingCards />}

      <FAQSection />

      {!user && <BlogFeed />}

      <section className="cta-section reveal">
        <div className="container">
          <div className="cta-card animate-glow">
            <div className="cta-glow"></div>
            {user ? (
              <>
                <h2>Ready to Write Your Next Essay?</h2>
                <p>Head to your dashboard to continue where you left off, or pick a tool from the writing suite.</p>
                <Link to="/dashboard" className="cta-btn">
                  Go to Dashboard <FiArrowRight />
                </Link>
              </>
            ) : (
              <>
                <h2>Ready to Write Amazing Essays?</h2>
                <p>Join thousands of students and professionals using AI to write better, faster.</p>
                <Link to="/register" className="cta-btn">
                  Get Started Now <FiArrowRight />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <FiChevronUp size={22} />
        </button>
      )}
    </div>
  );
}

export default Home;
