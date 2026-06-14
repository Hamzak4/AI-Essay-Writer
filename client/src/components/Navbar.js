import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiChevronDown, FiGrid, FiSun, FiMoon, FiShield } from 'react-icons/fi';
import { RiQuillPenLine } from 'react-icons/ri';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin, isVerified } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdminArea = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (isAdminArea) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <RiQuillPenLine className="logo-icon" />
          <span>EssayAI</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <FiGrid size={15} /> Dashboard
              </Link>
              <Link
                to="/essay-writer"
                className={`nav-link ${isActive('/essay-writer') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Write Essay
              </Link>
              <Link
                to="/history"
                className={`nav-link ${isActive('/history') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                History
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="nav-link admin-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiShield size={14} /> Admin
                </Link>
              )}
              <div className="nav-divider"></div>
              <div className="nav-user-wrap" ref={dropdownRef}>
                <button className="nav-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="nav-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                  <span className="nav-user-name">{user.name?.split(' ')[0] || 'User'}</span>
                  {!isVerified && <span className="nav-unverified-dot" title="Email not verified" />}
                  <FiChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                      <div>
                        <div className="dropdown-name">{user.name}</div>
                        <div className="dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    {!isVerified && (
                      <Link to="/verify-email" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FiShield size={14} /> Verify Email
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FiShield size={14} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiGrid size={15} /> Dashboard
                    </Link>
                    <Link to="/history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      History
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item dropdown-danger" onClick={handleLogout}>
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary nav-btn" onClick={() => setMenuOpen(false)}>
                Get Started Free
              </Link>
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
