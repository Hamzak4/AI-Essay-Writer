import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toolsAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function Summarizer() {
  const [text, setText] = useState('');
  const [length, setLength] = useState('a few sentences');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please paste text to summarize');
      return;
    }
    setError('');
    setOutput('');
    setLoading(true);
    try {
      const data = await toolsAPI.summarize({ text, length });
      setOutput(data.result);
      toast.success('Summary generated');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Could not copy');
    }
  };

  const inputWords = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const outputWords = output ? output.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Summarizer</h1>
        <p>Condense long text into a concise summary</p>
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
            <label>Text to summarize</label>
            <textarea
              className="input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the text you want to summarize..."
              rows={12}
              required
            />
            {text && <span className="input-counter">{inputWords} words · {text.length} characters</span>}
          </div>

          <div className="field-group">
            <label>Summary length</label>
            <select className="input-field" value={length} onChange={(e) => setLength(e.target.value)}>
              <option value="one sentence">One sentence</option>
              <option value="a few sentences">A few sentences</option>
              <option value="a short paragraph">A short paragraph</option>
              <option value="a detailed paragraph">A detailed paragraph</option>
            </select>
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Summarizing...</> : 'Summarize'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <div>
              <h3>Summary</h3>
              {output && <div className="output-meta"><span>{outputWords} words</span><span className="dot">·</span><span>{Math.round((1 - outputWords / inputWords) * 100)}% shorter</span></div>}
            </div>
            {output && (
              <button className={`copy-btn ${copied ? 'copied' : ''}`} type="button" onClick={handleCopy}>
                {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
              </button>
            )}
          </div>
          <div className={`output-area ${output ? '' : 'empty'}`}>
            {loading ? (
              <div className="loading-indicator">
                <div className="loading-dots"><span></span><span></span><span></span></div>
                Summarizing your text...
              </div>
            ) : output || 'Summary will appear here'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summarizer;
