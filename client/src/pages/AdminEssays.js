import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import './Admin.css';

function AdminEssays() {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewEssay, setViewEssay] = useState(null);

  const fetchEssays = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: '20' });
    if (search) params.append('search', search);

    axios.get(`/api/admin/essays?${params}`)
      .then(res => {
        setEssays(res.data.essays);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEssays(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEssays();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this essay? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/essays/${id}`);
      fetchEssays();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete essay');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Essays" />
        <div className="admin-content">
          <div className="admin-toolbar">
            <form className="admin-search" onSubmit={handleSearch}>
              <FiSearch />
              <input type="text" placeholder="Search essays..." value={search} onChange={e => setSearch(e.target.value)} />
            </form>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Tone</th>
                  <th>Word Count</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="admin-table-loading">Loading...</td></tr>
                ) : essays.length === 0 ? (
                  <tr><td colSpan={6} className="admin-table-empty">No essays found</td></tr>
                ) : essays.map(e => (
                  <tr key={e._id}>
                    <td className="admin-title-cell">{e.title || 'Untitled'}</td>
                    <td>{e.user?.name || 'Unknown'}</td>
                    <td><span className="badge badge-primary">{e.tone || 'Standard'}</span></td>
                    <td>{e.wordCount || e.content?.split(' ').length || 0}</td>
                    <td className="admin-date">{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td className="admin-actions">
                      <button className="admin-action-btn" onClick={() => setViewEssay(e)} title="View">
                        <FiEye />
                      </button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(e._id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}

          {viewEssay && (
            <div className="admin-modal-overlay" onClick={() => setViewEssay(null)}>
              <div className="admin-modal" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                  <h3>{viewEssay.title || 'Untitled Essay'}</h3>
                  <button onClick={() => setViewEssay(null)}><FiX /></button>
                </div>
                <div className="admin-modal-body">
                  <div className="admin-modal-meta">
                    <span>By: {viewEssay.user?.name || 'Unknown'}</span>
                    <span>Tone: {viewEssay.tone || 'Standard'}</span>
                    <span>Words: {viewEssay.wordCount || viewEssay.content?.split(' ').length || 0}</span>
                  </div>
                  <div className="admin-modal-content">{viewEssay.content || 'No content'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEssays;
