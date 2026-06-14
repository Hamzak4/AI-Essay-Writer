import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Particles from './components/Particles';
import DBStatus from './components/DBStatus';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EssayWriter from './pages/EssayWriter';
import Paraphraser from './pages/Paraphraser';
import GrammarChecker from './pages/GrammarChecker';
import Summarizer from './pages/Summarizer';
import CitationGenerator from './pages/CitationGenerator';
import OutlineGenerator from './pages/OutlineGenerator';
import TitleGenerator from './pages/TitleGenerator';
import History from './pages/History';
import VerifyEmail from './pages/VerifyEmail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminEssays from './pages/AdminEssays';
import AdminFooter from './pages/AdminFooter';

function ScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/admin/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Particles />
            <ScrollReveal />
            <Navbar />
            <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<PrivateRoute><VerifyEmail /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/essay-writer" element={<PrivateRoute><EssayWriter /></PrivateRoute>} />
                <Route path="/paraphraser" element={<PrivateRoute><Paraphraser /></PrivateRoute>} />
                <Route path="/grammar-checker" element={<PrivateRoute><GrammarChecker /></PrivateRoute>} />
                <Route path="/summarizer" element={<PrivateRoute><Summarizer /></PrivateRoute>} />
                <Route path="/citation-generator" element={<PrivateRoute><CitationGenerator /></PrivateRoute>} />
                <Route path="/outline-generator" element={<PrivateRoute><OutlineGenerator /></PrivateRoute>} />
                <Route path="/title-generator" element={<PrivateRoute><TitleGenerator /></PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                <Route path="/admin/essays" element={<AdminRoute><AdminEssays /></AdminRoute>} />
                <Route path="/admin/footer" element={<AdminRoute><AdminFooter /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
            <div style={{
              position: 'fixed',
              bottom: '16px',
              right: '16px',
              zIndex: 999,
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(71, 85, 105, 0.4)',
              borderRadius: 'var(--radius)',
              padding: '8px 14px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}>
              <DBStatus />
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
