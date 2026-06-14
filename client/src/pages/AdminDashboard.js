import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiFileText, FiUserPlus, FiActivity, FiTrendingUp } from 'react-icons/fi';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import './Admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <AdminNavbar title="Dashboard" />
          <div className="admin-content">
            <div className="admin-loading">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

    const cards = [
    { icon: <FiUsers />, label: 'Total Users', value: stats?.totalUsers || 0, color: '#6366f1' },
    { icon: <FiFileText />, label: 'Total Essays', value: stats?.totalEssays || 0, color: '#10b981' },
    { icon: <FiUserPlus />, label: 'New Today', value: stats?.usersToday || 0, color: '#f59e0b' },
    { icon: <FiActivity />, label: 'Active (7d)', value: stats?.activeUsers7d || 0, color: '#06b6d4' },
  ];

  const maxGrowth = Math.max(...(stats?.userGrowth?.map(g => g.count) || [1]), 1);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Dashboard" />
        <div className="admin-content">
          <div className="admin-stats-grid">
            {cards.map((card, i) => (
              <div className="admin-stat-card" key={i}>
                <div className="admin-stat-icon" style={{ background: `${card.color}18`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-value">{card.value}</span>
                  <span className="admin-stat-label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-section">
            <h3>User Growth (Last 30 Days)</h3>
            <div className="admin-chart">
              {stats?.userGrowth?.length > 0 ? (
                <div className="admin-bar-chart">
                  {stats.userGrowth.map((g, i) => (
                    <div className="admin-bar-item" key={i} title={`${g._id}: ${g.count}`}>
                      <div className="admin-bar-fill" style={{ height: `${(g.count / maxGrowth) * 100}%` }} />
                      <span className="admin-bar-label">{g._id?.slice(5)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No growth data yet</p>
              )}
            </div>
          </div>

          <div className="admin-stats-mini">
            <div className="admin-mini-card">
              <FiTrendingUp />
              <div>
                <span>Total Admins</span>
                <strong>{stats?.totalAdmins || 0}</strong>
              </div>
            </div>
            <div className="admin-mini-card">
              <FiUsers />
              <div>
                <span>Banned Users</span>
                <strong>{stats?.totalBanned || 0}</strong>
              </div>
            </div>
            <div className="admin-mini-card">
              <FiActivity />
              <div>
                <span>Unverified</span>
                <strong>{stats?.unverified || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
