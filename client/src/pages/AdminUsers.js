import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiTrash2, FiToggleLeft, FiToggleRight, FiShield } from 'react-icons/fi';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import './Admin.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: '20' });
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);

    axios.get(`/api/admin/users?${params}`)
      .then(res => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleBan = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/ban`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to toggle ban');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Users" />
        <div className="admin-content">
          <div className="admin-toolbar">
            <form className="admin-search" onSubmit={handleSearch}>
              <FiSearch />
              <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </form>
            <select className="admin-filter" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="">All Users</option>
              <option value="banned">Banned</option>
              <option value="admin">Admins</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="admin-table-loading">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="admin-table-empty">No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className={u.isBanned ? 'row-banned' : ''}>
                    <td className="admin-user-cell">
                      <div className="admin-user-avatar">{u.name?.charAt(0) || '?'}</div>
                      <span>{u.name}</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.role === 'admin' ? <span className="admin-role-badge"><FiShield size={12} /> Admin</span> : 'User'}</td>
                    <td>
                      {u.isBanned ? <span className="badge badge-error">Banned</span>
                        : u.isVerified ? <span className="badge badge-success">Active</span>
                        : <span className="badge badge-warning">Unverified</span>}
                    </td>
                    <td className="admin-date">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="admin-actions">
                      <button className="admin-action-btn" onClick={() => handleBan(u._id)} title={u.isBanned ? 'Unban' : 'Ban'}>
                        {u.isBanned ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(u._id)} title="Delete">
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
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
