import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { RiQuillPenLine } from 'react-icons/ri';
import './Auth.css';

function VerifyEmail() {
  const navigate = useNavigate();
  const { user, verifyEmail, resendCode, loading } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!user) navigate('/login');
    if (user?.isVerified) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const t = setInterval(() => setTimer(p => p - 1), 1000);
      return () => clearInterval(t);
    }
    if (timer === 0) setCanResend(true);
  }, [timer, canResend]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    data.split('').forEach((char, i) => { newCode[i] = char; });
    setCode(newCode);
    const nextIndex = Math.min(data.length, 5);
    if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    const result = await verifyEmail(fullCode);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setError(result.error);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimer(60);
    await resendCode();
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in">
          <div className="auth-logo" style={{ background: 'var(--gradient-2)' }}>
            <FiCheck />
          </div>
          <h1>Email Verified!</h1>
          <p className="auth-sub">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <FiMail />
        </div>
        <h1>Verify Your Email</h1>
        <p className="auth-sub">
          Enter the 6-digit code sent to <strong>{user?.email}</strong>
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="verify-code-wrap">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="verify-code-input"
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                autoFocus={i === 0}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <button className="btn-primary" type="submit" disabled={loading || code.join('').length !== 6}>
            {loading ? <span className="loading-spinner"></span> : 'Verify Email'}
          </button>
        </form>
        <div className="verify-resend">
          {canResend ? (
            <button className="btn-ghost" onClick={handleResend}>
              <FiRefreshCw size={14} /> Resend Code
            </button>
          ) : (
            <span className="verify-timer">Resend in {timer}s</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
