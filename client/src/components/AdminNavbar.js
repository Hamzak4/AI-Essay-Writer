import React from 'react';
import { useAuth } from '../context/AuthContext';

function AdminNavbar({ title }) {
  const { user } = useAuth();

  return (
    <div className="admin-navbar">
      <h2>{title}</h2>
      <div className="admin-navbar-right">
        <div className="nav-user" style={{ cursor: 'default', background: 'transparent', border: 'none', padding: '6px 0' }}>
          <div className="nav-avatar">{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
          <span className="nav-user-name">{user?.name?.split(' ')[0] || 'Admin'}</span>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
