import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import './Admin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('This area is for administrators only');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card fade-in">
        <div className="admin-login-badge">
          <FiShield /> Admin
        </div>
        <h1>Admin Login</h1>
        <p className="auth-sub">Sign in with your admin credentials</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="field-group">
            <label>Email</label>
            <div className="input-wrap">
              <FiMail className="input-icon" />
              <input className="input-field input-with-icon" type="email" placeholder="admin@essayai.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="field-group">
            <label>Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input className="input-field input-with-icon" type="password" placeholder="Admin password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="loading-spinner"></span> : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
