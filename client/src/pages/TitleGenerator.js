import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toolsAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function TitleGenerator() {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setTitles([]);
    setLoading(true);
    try {
      const data = await toolsAPI.titleGenerator({ topic });
      const list = (data.result || '')
        .split(/\n+/)
        .map((s) => s.replace(/^\s*\d+[\.\)]\s*/, '').trim())
        .filter(Boolean);
      setTitles(list);
      toast.success(`${list.length} titles generated`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate titles');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (title, idx) => {
    const ok = await copyToClipboard(title);
    if (ok) {
      setCopiedIdx(idx);
      toast.success('Title copied');
      setTimeout(() => setCopiedIdx(null), 2000);
    } else {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Title Generator</h1>
        <p>Get creative and engaging title ideas for your essay</p>
      </div>

      <div className="tool-grid">
        <form className="tool-panel" onSubmit={handleSubmit}>
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button type="button" className="btn-ghost" onClick={handleSubmit} style={{ marginLeft: 'auto', padding: '4px 12px', fontSize: '0.85rem' }}>
                <FiRefreshCw /> Retry
              </button>
            </div>
          )}

          <div className="field-group">
            <label>Topic</label>
            <input
              className="input-field"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. renewable energy in developing countries"
              required
            />
            <span className="input-counter">{topic.length} characters</span>
          </div>

          <div className="field-group">
            <label style={{ color: 'var(--text-muted)' }}>Tip</label>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              The more specific your topic, the better the suggestions. Click any title to copy it.
            </p>
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Generating...</> : 'Generate Titles'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <h3>Suggestions ({titles.length})</h3>
          </div>
          {titles.length === 0 ? (
            <div className="output-area empty">
              {loading ? (
                <div className="loading-indicator">
                  <div className="loading-dots"><span></span><span></span><span></span></div>
                  Brainstorming titles...
                </div>
              ) : 'Title suggestions will appear here'}
            </div>
          ) : (
            <ul className="result-list">
              {titles.map((t, i) => (
                <li key={i} onClick={() => handleCopy(t, i)} title="Click to copy">
                  {t}
                  <span className="copy-hint">{copiedIdx === i ? <><FiCheck /> Copied</> : 'Click to copy'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TitleGenerator;
