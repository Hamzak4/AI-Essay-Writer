import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toolsAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function CitationGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('APA');
  const [citations, setCitations] = useState([]);
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
    setCitations([]);
    setLoading(true);
    try {
      const data = await toolsAPI.citation({ topic, style });
      const list = (data.result || '')
        .split(/\n+/)
        .map((s) => s.replace(/^\s*\d+[\.\)]\s*/, '').trim())
        .filter(Boolean);
      setCitations(list);
      toast.success(`${list.length} citations generated`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate citations');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, idx) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIdx(idx);
      toast.success('Citation copied');
      setTimeout(() => setCopiedIdx(null), 2000);
    } else {
      toast.error('Could not copy');
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(citations.join('\n\n'));
    if (ok) toast.success('All citations copied');
    else toast.error('Could not copy');
  };

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Citation Generator</h1>
        <p>Generate realistic academic citations in your preferred style</p>
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
            <label>Topic or subject</label>
            <input
              className="input-field"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. climate change adaptation"
              required
            />
            <span className="input-counter">{topic.length} characters</span>
          </div>

          <div className="field-group">
            <label>Citation style</label>
            <select className="input-field" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
              <option value="Harvard">Harvard</option>
            </select>
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Generating...</> : 'Generate Citations'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <h3>Citations ({citations.length})</h3>
            {citations.length > 0 && (
              <button className="copy-btn" type="button" onClick={handleCopyAll}>
                <FiCopy /> Copy All
              </button>
            )}
          </div>
          {citations.length === 0 ? (
            <div className="output-area empty">
              {loading ? (
                <div className="loading-indicator">
                  <div className="loading-dots"><span></span><span></span><span></span></div>
                  Looking up sources...
                </div>
              ) : 'Citations will appear here'}
            </div>
          ) : (
            <ul className="result-list">
              {citations.map((c, i) => (
                <li key={i} onClick={() => handleCopy(c, i)} title="Click to copy">
                  {c}
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

export default CitationGenerator;
