import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiMail, FiMapPin, FiLink, FiType } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import './Admin.css';

const defaultFooter = {
  description: 'Transform your ideas into well-structured, engaging essays with the power of AI. Trusted by thousands of students and professionals worldwide.',
  email: 'hello@essayai.com',
  location: 'San Francisco, CA',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  github: 'https://github.com',
  copyright: 'EssayAI',
  poweredBy: 'Powered by Google Gemini AI',
};

function AdminFooter() {
  const [form, setForm] = useState({ ...defaultFooter });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/footer')
      .then(res => {
        if (res.data) setForm(prev => ({ ...prev, ...res.data }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/footer', form);
      toast.success('Footer settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save footer settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Footer Settings" />
        <div className="admin-content"><div className="admin-loading">Loading...</div></div>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Footer Settings" />
        <div className="admin-content">
          <form className="admin-footer-form" onSubmit={handleSave}>
            <div className="admin-section">
              <h3>Brand</h3>
              <div className="admin-field">
                <label><FiType /> Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
            </div>

            <div className="admin-section">
              <h3>Contact</h3>
              <div className="admin-field">
                <label><FiMail /> Email</label>
                <input name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="admin-field">
                <label><FiMapPin /> Location</label>
                <input name="location" value={form.location} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-section">
              <h3>Social Links</h3>
              <div className="admin-field">
                <label><FiLink /> Twitter URL</label>
                <input name="twitter" value={form.twitter} onChange={handleChange} />
              </div>
              <div className="admin-field">
                <label><FiLink /> LinkedIn URL</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} />
              </div>
              <div className="admin-field">
                <label><FiLink /> GitHub URL</label>
                <input name="github" value={form.github} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-section">
              <h3>Footer Bar</h3>
              <div className="admin-field">
                <label><FiType /> Copyright Brand Name</label>
                <input name="copyright" value={form.copyright} onChange={handleChange} />
              </div>
              <div className="admin-field">
                <label><FiType /> Powered By Text</label>
                <input name="poweredBy" value={form.poweredBy} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-save-btn" disabled={saving}>
                <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminFooter;
