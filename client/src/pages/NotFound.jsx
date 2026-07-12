import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', margin: '0', color: '#1e293b' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1.5rem', color: '#64748b' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', color: '#64748b' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '0.375rem', fontWeight: '500' }}>
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
