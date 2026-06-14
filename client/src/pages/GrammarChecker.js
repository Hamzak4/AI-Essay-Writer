import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toolsAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function GrammarChecker() {
  const [text, setText] = useState('');
  const [corrected, setCorrected] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please paste text to check');
      return;
    }
    setError('');
    setCorrected('');
    setErrors([]);
    setLoading(true);
    try {
      const data = await toolsAPI.grammarCheck({ text });
      setCorrected(data.corrected || '');
      setErrors(Array.isArray(data.errors) ? data.errors : []);
      const n = (data.errors || []).length;
      toast.success(n ? `${n} issue${n === 1 ? '' : 's'} found` : 'No issues found');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check grammar');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(corrected);
    if (ok) {
      setCopied(true);
      toast.success('Corrected text copied');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Could not copy');
    }
  };

  const outputWords = corrected ? corrected.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Grammar Checker</h1>
        <p>Find and fix grammar, spelling, and punctuation issues</p>
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
            <label>Your text</label>
            <textarea
              className="input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the text you want to check..."
              rows={10}
              required
            />
            {text && <span className="input-counter">{text.length} characters</span>}
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Checking...</> : 'Check Grammar'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <div>
              <h3>Corrected Text</h3>
              {corrected && <div className="output-meta"><span>{outputWords} words</span></div>}
            </div>
            {corrected && (
              <button className={`copy-btn ${copied ? 'copied' : ''}`} type="button" onClick={handleCopy}>
                {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
              </button>
            )}
          </div>
          <div className={`output-area ${corrected ? '' : 'empty'}`}>
            {loading ? (
              <div className="loading-indicator">
                <div className="loading-dots"><span></span><span></span><span></span></div>
                Checking your text...
              </div>
            ) : corrected || 'Corrected text will appear here'}
          </div>

          {errors.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 12 }}>Issues Found ({errors.length})</h3>
              <div className="grammar-errors">
                {errors.map((e, i) => (
                  <div className="grammar-error" key={i}>
                    <span className="original">{e.original}</span>
                    <span className="correction">{e.correction}</span>
                    {e.explanation && <span className="explanation">{e.explanation}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrammarChecker;
