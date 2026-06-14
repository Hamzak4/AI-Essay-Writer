import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  RiQuillPenLine, RiMagicLine, RiCheckboxCircleLine, RiFileTextLine,
  RiBookmarkLine, RiListUnordered, RiText, RiLightbulbLine
} from 'react-icons/ri';
import {
  FiArrowRight, FiTrash2, FiFileText, FiClock, FiPieChart,
  FiTarget, FiTrendingUp, FiStar, FiBarChart2, FiCalendar
} from 'react-icons/fi';
import './Dashboard.css';

const tips = [
  { icon: <RiLightbulbLine />, text: 'Start with a strong thesis statement to guide your entire essay.' },
  { icon: <RiLightbulbLine />, text: 'Use the Outline Generator first to structure your thoughts before writing.' },
  { icon: <RiLightbulbLine />, text: 'Break long writing sessions into 25-minute focused sprints.' },
  { icon: <RiLightbulbLine />, text: 'Review and personalize AI-generated content to match your voice.' },
  { icon: <RiLightbulbLine />, text: 'Use the Grammar Checker as a final polish before submitting.' },
];

const quickActions = [
  { label: 'New Essay', icon: <RiQuillPenLine />, to: '/essay-writer', color: '#6366f1' },
  { label: 'Paraphrase', icon: <RiMagicLine />, to: '/paraphraser', color: '#8b5cf6' },
  { label: 'Check Grammar', icon: <RiCheckboxCircleLine />, to: '/grammar-checker', color: '#10b981' },
  { label: 'View History', icon: <RiFileTextLine />, to: '/history', color: '#f59e0b' },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [currentTip, setCurrentTip] = useState(0);
  const [dailyGoal] = useState(500);
  const [dailyProgress, setDailyProgress] = useState(0);

  useEffect(() => {
    loadEssays();
    const tipInterval = setInterval(() => {
      setCurrentTip((i) => (i + 1) % tips.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, []);

  const loadEssays = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/essay/history');
      const essayList = res.data.essays || [];
      setEssays(essayList);
      const todayWords = essayList
        .filter((e) => {
          const d = new Date(e.createdAt);
          const now = new Date();
          return d.toDateString() === now.toDateString();
        })
        .reduce((sum, e) => sum + (e.wordCount || 0), 0);
      setDailyProgress(todayWords);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load essays');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this essay?')) return;
    try {
      await axios.delete(`/api/essay/${id}`);
      setEssays(essays.filter(e => e._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleQuickStart = (e) => {
    e.preventDefault();
    navigate('/essay-writer', { state: { topic: topic.trim() } });
  };

  const tools = [
    { to: '/essay-writer', icon: <RiQuillPenLine />, title: 'Essay Writer', desc: 'Generate full essays', color: '#6366f1' },
    { to: '/paraphraser', icon: <RiMagicLine />, title: 'Paraphraser', desc: 'Rewrite any text', color: '#8b5cf6' },
    { to: '/grammar-checker', icon: <RiCheckboxCircleLine />, title: 'Grammar Check', desc: 'Fix errors instantly', color: '#10b981' },
    { to: '/summarizer', icon: <RiFileTextLine />, title: 'Summarizer', desc: 'Condense long text', color: '#f59e0b' },
    { to: '/citation-generator', icon: <RiBookmarkLine />, title: 'Citations', desc: 'APA, MLA, Chicago', color: '#06b6d4' },
    { to: '/outline-generator', icon: <RiListUnordered />, title: 'Outline', desc: 'Structure your essay', color: '#ec4899' },
    { to: '/title-generator', icon: <RiText />, title: 'Titles', desc: 'Catchy essay titles', color: '#f97316' },
  ];

  const totalWords = essays.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const recentEssays = essays.slice(0, 5);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const getWeeklyActivity = useCallback(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = essays.filter((e) => {
        const ed = new Date(e.createdAt);
        return ed.toDateString() === d.toDateString();
      }).length;
      const isToday = i === 0;
      days.push({ label: dayLabel, count, isToday });
    }
    return days;
  }, [essays]);

  const weeklyActivity = getWeeklyActivity();
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.count), 1);

  const progressPercent = Math.min((dailyProgress / dailyGoal) * 100, 100);

  return (
    <div className="dashboard fade-in">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Writer'}</h1>
            <p className="dashboard-date"><FiCalendar size={14} /> {todayStr}</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="stats-row">
          <div className="stat-card card-glass-strong slide-up">
            <div className="stat-card-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' }}>
              <FiFileText />
            </div>
            <div className="stat-card-info">
              <strong>{essays.length}</strong>
              <span>Essays Written</span>
            </div>
          </div>
          <div className="stat-card card-glass-strong slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7' }}>
              <FiPieChart />
            </div>
            <div className="stat-card-info">
              <strong>{totalWords.toLocaleString()}</strong>
              <span>Total Words</span>
            </div>
          </div>
          <div className="stat-card card-glass-strong slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#fcd34d' }}>
              <FiClock />
            </div>
            <div className="stat-card-info">
              <strong>{tools.length}</strong>
              <span>AI Tools</span>
            </div>
          </div>
        </div>

        <div className="dashboard-mid-grid">
          <div className="quick-start card card-gradient-border slide-up">
            <div className="quick-start-header">
              <FiFileText size={18} />
              <h3>Quick Start: Write a New Essay</h3>
            </div>
            <div className="quick-form">
              <input
                className="input-field"
                type="text"
                placeholder="What's your essay topic?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button className="btn-primary" type="submit" onClick={handleQuickStart}>
                Generate <FiArrowRight />
              </button>
            </div>
          </div>

          <div className="daily-goal-card card-glass-strong slide-up">
            <div className="goal-header">
              <FiTarget size={18} />
              <h3>Daily Word Goal</h3>
            </div>
            <div className="goal-progress-wrap">
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="goal-stats">
                <span className="goal-current">{dailyProgress.toLocaleString()}</span>
                <span className="goal-sep">/</span>
                <span className="goal-target">{dailyGoal.toLocaleString()}</span>
                <span className="goal-label">words today</span>
              </div>
            </div>
            {progressPercent >= 100 && (
              <div className="goal-complete">
                <FiStar /> Daily goal achieved!
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-mid-grid-2">
          <div className="activity-card card-glass-strong slide-up">
            <div className="activity-header">
              <FiBarChart2 size={18} />
              <h3>This Week</h3>
            </div>
            <div className="activity-bars">
              {weeklyActivity.map((day, i) => (
                <div className="activity-day" key={i}>
                  <div className="activity-bar-wrap">
                    <div
                      className={`activity-bar ${day.isToday ? 'today' : ''}`}
                      style={{ height: `${(day.count / maxActivity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="activity-label">{day.label}</span>
                  <span className="activity-count">{day.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions-card card-glass-strong slide-up">
            <div className="quick-actions-header">
              <FiTrendingUp size={18} />
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, i) => (
                <Link to={action.to} className="quick-action-btn" key={i}
                  style={{ '--action-color': action.color }}>
                  <span className="quick-action-icon" style={{ background: `${action.color}18`, color: action.color }}>
                    {action.icon}
                  </span>
                  <span className="quick-action-label">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="tip-card card-glass-strong slide-up">
            <div className="tip-header">
              <RiLightbulbLine size={18} className="tip-bulb" />
              <h3>Writing Tip</h3>
            </div>
            <div className="tip-content">
              {tips.map((tip, i) => (
                <div className={`tip-text ${i === currentTip ? 'active' : ''}`} key={i}>
                  <span className="tip-icon">{tip.icon}</span>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
            <div className="tip-dots">
              {tips.map((_, i) => (
                <span key={i} className={`tip-dot ${i === currentTip ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="section-header reveal">
          <h2 className="section-title">AI Writing Tools</h2>
        </div>
        <div className="dash-tools-grid reveal">
          {tools.map((tool, i) => (
            <Link to={tool.to} className="dash-tool-card card-glass-strong" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="dash-tool-icon" style={{ color: tool.color, background: `${tool.color}15` }}>
                {tool.icon}
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="section-header reveal">
          <h2 className="section-title">Recent Essays</h2>
          {essays.length > 0 && <Link to="/history" className="view-all">View all <FiArrowRight /></Link>}
        </div>

        {loading ? (
          <div className="card card-glass-strong loading-state">
            <span className="loading-spinner"></span> Loading essays...
          </div>
        ) : essays.length === 0 ? (
          <div className="card card-glass-strong empty-state">
            <div className="empty-state-icon">
              <RiQuillPenLine />
            </div>
            <h3>Your essay journey starts here</h3>
            <p>Generate your first essay and it will appear here. Try one of our AI writing tools to get started.</p>
            <div className="empty-actions">
              <Link to="/essay-writer" className="btn-primary pulse-glow">Write Your First Essay</Link>
              <Link to="/outline-generator" className="btn-secondary">Start with an Outline</Link>
            </div>
          </div>
        ) : (
          <div className="essay-list reveal">
            {recentEssays.map((essay) => (
              <div className="essay-card card card-glass-strong" key={essay._id}>
                <div className="essay-info">
                  <h3>{essay.title}</h3>
                  <p>{essay.content.slice(0, 140)}{essay.content.length > 140 ? '...' : ''}</p>
                  <div className="essay-meta">
                    <span className="badge badge-primary">{essay.tone}</span>
                    <span>{new Date(essay.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{essay.wordCount} words</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(essay._id)} title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
