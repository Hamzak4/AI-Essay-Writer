import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiFileText, FiArrowLeft, FiLayout } from 'react-icons/fi';
import { RiQuillPenLine } from 'react-icons/ri';

function AdminSidebar() {
  const location = useLocation();

  const links = [
    { path: '/admin', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/essays', icon: <FiFileText />, label: 'Essays' },
    { path: '/admin/footer', icon: <FiLayout />, label: 'Footer' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <RiQuillPenLine />
        <span>Admin Panel</span>
      </div>
      <nav className="admin-sidebar-nav">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`admin-sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', margin: 'auto 8px 0' }}>
          <Link to="/dashboard" className="admin-sidebar-link">
            <FiArrowLeft />
            <span>Back to App</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
