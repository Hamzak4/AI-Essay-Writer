import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { RiQuillPenLine, RiMailLine, RiMapPinLine, RiLinkedinFill, RiTwitterXFill, RiGithubFill } from 'react-icons/ri';
import { FiSend } from 'react-icons/fi';
import './Footer.css';

const tools = [
  { name: 'Essay Writer', path: '/essay-writer' },
  { name: 'Paraphraser', path: '/paraphraser' },
  { name: 'Grammar Checker', path: '/grammar-checker' },
  { name: 'Summarizer', path: '/summarizer' },
  { name: 'Citation Generator', path: '/citation-generator' },
  { name: 'Outline Generator', path: '/outline-generator' },
  { name: 'Title Generator', path: '/title-generator' },
];

const defaults = {
  description: 'Transform your ideas into well-structured, engaging essays with the power of AI. Trusted by thousands of students and professionals worldwide.',
  email: 'hello@essayai.com',
  location: 'San Francisco, CA',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  github: 'https://github.com',
  copyright: 'EssayAI',
  poweredBy: 'Powered by Google Gemini AI',
};

function Footer() {
  const { user } = useAuth();
  const location = useLocation();
  const [settings, setSettings] = useState(defaults);
  const isAdminArea = location.pathname.startsWith('/admin');

  useEffect(() => {
    axios.get('/api/admin/footer')
      .then(res => {
        if (res.data) setSettings(prev => ({ ...prev, ...res.data }));
      })
      .catch(() => {});
  }, []);

  if (isAdminArea) return null;

  return (
    <footer className="site-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg-card)" />
        </svg>
      </div>
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <Link to="/" className="footer-logo">
                <RiQuillPenLine className="footer-logo-icon" />
                <span>EssayAI</span>
              </Link>
              <p className="footer-desc">{settings.description}</p>
              <div className="footer-social">
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                  <RiTwitterXFill />
                </a>
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  <RiLinkedinFill />
                </a>
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <RiGithubFill />
                </a>
                <a href={`mailto:${settings.email}`} className="social-link" aria-label="Email">
                  <RiMailLine />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                {user ? (
                  <>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/history">History</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Sign In</Link></li>
                    <li><Link to="/register">Get Started</Link></li>
                  </>
                )}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">AI Tools</h4>
              <ul className="footer-links">
                {tools.map((tool) => (
                  <li key={tool.path}>
                    <Link to={tool.path}>{tool.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-contact">
                <li>
                  <RiMailLine className="contact-icon" />
                  <div>
                    <span>Email</span>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </div>
                </li>
                <li>
                  <RiMapPinLine className="contact-icon" />
                  <div>
                    <span>Location</span>
                    <span>{settings.location}</span>
                  </div>
                </li>
              </ul>
              <div className="footer-newsletter">
                <h4 className="footer-heading">Stay Updated</h4>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Enter your email" className="newsletter-input" />
                  <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                    <FiSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>&copy; {new Date().getFullYear()} {settings.copyright}. All rights reserved.</p>
            <p className="footer-powered">{settings.poweredBy}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
