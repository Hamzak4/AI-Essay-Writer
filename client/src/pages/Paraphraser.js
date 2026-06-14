import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toolsAPI } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import './ToolPage.css';

function Paraphraser() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('standard');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please paste some text to paraphrase');
      return;
    }
    setError('');
    setOutput('');
    setLoading(true);
    try {
      const data = await toolsAPI.paraphrase({ text, style });
      setOutput(data.result);
      toast.success('Text paraphrased');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to paraphrase');
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

  const outputWords = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const inputWords = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="tool-page fade-in">
      <div className="page-header">
        <h1>Paraphraser</h1>
        <p>Rewrite any text in a different style while keeping its meaning</p>
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
              placeholder="Paste the text you want to paraphrase..."
              rows={10}
              required
            />
            {text && <span className="input-counter">{inputWords} words · {text.length} characters</span>}
          </div>

          <div className="field-group">
            <label>Style</label>
            <select className="input-field" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="standard">Standard</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
              <option value="creative">Creative</option>
              <option value="simple">Simple</option>
            </select>
          </div>

          <div className="tool-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Paraphrasing...</> : 'Paraphrase'}
            </button>
          </div>
        </form>

        <div className="tool-panel">
          <div className="output-header">
            <div>
              <h3>Result</h3>
              {output && <div className="output-meta"><span>{outputWords} words</span></div>}
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
                Rewriting your text...
              </div>
            ) : output || 'Paraphrased text will appear here'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paraphraser;
