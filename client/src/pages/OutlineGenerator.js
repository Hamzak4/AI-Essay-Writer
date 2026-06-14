import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toolsAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function OutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('research');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setOutline('');
    setLoading(true);
    try {
      const data = await toolsAPI.outline({ topic, type });
      setOutline(data.result);
      toast.success('Outline generated');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate outline');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(outline);
    if (ok) {
      setCopied(true);
      toast.success('Outline copied');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Outline Generator</h1>
        <p>Build a structured outline for your essay before you write</p>
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
              placeholder="e.g. The ethics of artificial intelligence"
              required
            />
            <span className="input-counter">{topic.length} characters</span>
          </div>

          <div className="field-group">
            <label>Essay type</label>
            <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="research">Research</option>
              <option value="argumentative">Argumentative</option>
              <option value="compare-contrast">Compare / Contrast</option>
              <option value="narrative">Narrative</option>
              <option value="descriptive">Descriptive</option>
            </select>
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Generating...</> : 'Generate Outline'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <h3>Outline</h3>
            {outline && (
              <button className={`copy-btn ${copied ? 'copied' : ''}`} type="button" onClick={handleCopy}>
                {copied ? <><FiCheck /> Copied</> : <FiCopy />}
              </button>
            )}
          </div>
          <div className={`output-area ${outline ? '' : 'empty'}`}>
            {loading ? (
              <div className="loading-indicator">
                <div className="loading-dots"><span></span><span></span><span></span></div>
                Building your outline...
              </div>
            ) : outline || 'Your outline will appear here'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutlineGenerator;
