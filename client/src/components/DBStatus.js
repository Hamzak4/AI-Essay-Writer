import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DBStatus({ variant = 'dot' }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await axios.get('/api/health');
        if (mounted) setStatus(res.data.status);
      } catch {
        if (mounted) setStatus('disconnected');
      }
    };
    check();
    const interval = setInterval(check, 15000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (variant === 'minimal') {
    return (
      <span className="db-status" title={`Database: ${status}`}>
        <span className={`db-status-dot ${status}`} />
        {status === 'connected' ? 'DB Connected' : status === 'checking' ? 'Checking...' : 'DB Offline'}
      </span>
    );
  }

  return (
    <span className="db-status" title={`Database: ${status}`}>
      <span className={`db-status-dot ${status}`} />
      {status === 'connected' ? 'All systems operational' : status === 'checking' ? 'Checking connection...' : 'Database disconnected'}
    </span>
  );
}

export default DBStatus;
