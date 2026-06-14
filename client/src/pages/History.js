import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTrash2, FiEye, FiX, FiClock, FiFileText } from 'react-icons/fi';
import { RiQuillPenLine } from 'react-icons/ri';
import { essayAPI } from '../utils/api';
import './Dashboard.css';
import './History.css';

function History() {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(null);

  useEffect(() => {
    loadEssays();
  }, []);

  const loadEssays = async () => {
    try {
      setLoading(true);
      const data = await essayAPI.history();
      setEssays(data.essays || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load essays');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this essay?')) return;
    try {
      await essayAPI.remove(id);
      setEssays(essays.filter((e) => e._id !== id));
      if (active && active._id === id) setActive(null);
      toast.success('Essay deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="dashboard fade-in">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Your Essay History</h1>
            <p>All essays you've generated, newest first</p>
          </div>
          {essays.length > 0 && (
            <div className="badge badge-primary">
              <FiFileText size={13} /> {essays.length} essays
            </div>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="card card-glass-strong loading-state">
            <span className="loading-spinner"></span> Loading essays...
          </div>
        ) : essays.length === 0 ? (
          <div className="card card-glass-strong empty-state">
            <div className="empty-state-icon">
              <RiQuillPenLine />
            </div>
            <p>You haven't written any essays yet.</p>
            <Link to="/essay-writer" className="btn-primary pulse-glow">Write Your First Essay</Link>
          </div>
        ) : (
          <div className="essay-list">
            {essays.map((essay) => (
              <div className="essay-card card card-glass-strong" key={essay._id}>
                <div className="essay-info">
                  <h3>{essay.title}</h3>
                  <p>{essay.content.slice(0, 200)}{essay.content.length > 200 ? '...' : ''}</p>
                  <div className="essay-meta">
                    <span className="badge badge-primary">{essay.tone}</span>
                    <FiClock size={12} /><span>{new Date(essay.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{essay.wordCount} words</span>
                  </div>
                </div>
                <div className="essay-actions">
                  <button className="action-btn view" onClick={() => setActive(essay)} title="View">
                    <FiEye />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(essay._id)} title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {active && (
          <div className="history-modal-backdrop" onClick={() => setActive(null)}>
            <div className="history-modal" onClick={(e) => e.stopPropagation()}>
              <div className="history-modal-header">
                <h2>{active.title}</h2>
                <button className="delete-btn" onClick={() => setActive(null)} title="Close">
                  <FiX />
                </button>
              </div>
              <div className="history-modal-meta">
                <span className="badge badge-primary">{active.tone}</span>
                {new Date(active.createdAt).toLocaleString()} · {active.wordCount} words
              </div>
              <div className="history-modal-content">{active.content}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
