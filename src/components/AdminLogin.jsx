import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import udupuLogo from '../assets/logo.png';

function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default PIN is 1234. In a real app this would be validated securely.
    if (pin === '1945') {
      onLogin();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '3rem 2rem' }}>
        <img src={udupuLogo} alt="Udupu" style={{ width: '72px', height: '72px', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)' }} />
        
        <h2 style={{ marginBottom: '0.5rem' }}>Udupu Admin</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter the 4-digit PIN to access inventory management.</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="Enter PIN" 
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', marginBottom: '1rem' }}
            maxLength={4}
            autoFocus
          />
          
          {error && (
            <p style={{ color: '#FF6B6B', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <LogIn size={20} /> Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
