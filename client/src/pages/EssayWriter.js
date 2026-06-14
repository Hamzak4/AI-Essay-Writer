import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { essayAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function EssayWriter() {
  const location = useLocation();
  const [form, setForm] = useState({
    topic: location.state?.topic || '',
    tone: 'formal',
    length: 'medium',
    type: 'essay',
  });
  const [output, setOutput] = useState('');
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setOutput('');
    setMeta(null);
    setLoading(true);
    try {
      const data = await essayAPI.generate(form);
      setOutput(data.essay.content);
      setMeta({ title: data.essay.title, wordCount: data.essay.wordCount });
      toast.success('Essay saved to history');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate essay');
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
      toast.error('Could not copy — please select and copy manually');
    }
  };

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Essay Writer</h1>
        <p>Generate a full essay on any topic, in your preferred tone and length</p>
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
              name="topic"
              placeholder="e.g. The impact of AI on modern education"
              value={form.topic}
              onChange={handleChange}
              required
            />
            <span className="input-counter">{form.topic.length} characters</span>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Type</label>
              <select className="input-field" name="type" value={form.type} onChange={handleChange}>
                <option value="essay">Essay</option>
                <option value="argumentative">Argumentative</option>
                <option value="persuasive">Persuasive</option>
                <option value="compare-contrast">Compare / Contrast</option>
                <option value="analytical">Analytical</option>
              </select>
            </div>
            <div className="field-group">
              <label>Tone</label>
              <select className="input-field" name="tone" value={form.tone} onChange={handleChange}>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label>Length</label>
            <select className="input-field" name="length" value={form.length} onChange={handleChange}>
              <option value="short">Short (~300 words)</option>
              <option value="medium">Medium (~600 words)</option>
              <option value="long">Long (~1000 words)</option>
            </select>
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Generating...</> : 'Generate Essay'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <div>
              <h3>Output</h3>
              {meta && <div className="output-meta"><span>{meta.title}</span><span className="dot">·</span><span>{meta.wordCount} words</span></div>}
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
                AI is writing your essay...
              </div>
            ) : output ? (
              output
            ) : (
              'Your essay will appear here'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EssayWriter;
