import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiQuillPenLine } from 'react-icons/ri';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const { register, googleLogin, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const googleCallbackRef = useRef(null);

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  googleCallbackRef.current = async (response) => {
    const result = await googleLogin(response.credential);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    if (!clientId) return;

    const initGSI = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp) => googleCallbackRef.current?.(resp),
        });
        const container = document.getElementById('google-button-container');
        if (container) {
          window.google.accounts.id.renderButton(container, {
            type: 'standard',
            shape: 'pill',
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            width: '100%',
          });
        }
      }
    };

    initGSI();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGSI();
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [clientId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    if (result.success) {
      navigate('/verify-email');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <RiQuillPenLine />
        </div>
        <h1>Create Account</h1>
        <p className="auth-sub">Join EssayAI and start writing smarter</p>
        <div className="auth-social" id="google-button-container">
        </div>
        <div className="auth-divider">
          <span>or sign up with email</span>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="field-group">
            <label>Name</label>
            <div className="input-wrap">
              <FiUser className="input-icon" />
              <input
                className="input-field input-with-icon"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>
          <div className="field-group">
            <label>Email</label>
            <div className="input-wrap">
              <FiMail className="input-icon" />
              <input
                className="input-field input-with-icon"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="field-group">
            <label>Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input
                className="input-field input-with-icon"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className={`strength-fill ${form.password.length < 6 ? 'weak' : form.password.length < 10 ? 'medium' : 'strong'}`}
                    style={{ width: `${Math.min(100, (form.password.length / 12) * 100)}%` }} />
                </div>
                <span className={`strength-label ${form.password.length < 6 ? 'weak' : form.password.length < 10 ? 'medium' : 'strong'}`}>
                  {form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Medium' : 'Strong'}
                </span>
              </div>
            )}
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
