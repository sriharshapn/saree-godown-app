import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [sarees, setSarees] = useState(() => {
    const saved = localStorage.getItem('sareeInventory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sareeInventory', JSON.stringify(sarees));
  }, [sarees]);

  const addSaree = (saree) => {
    setSarees([...sarees, { ...saree, id: crypto.randomUUID(), status: 'available', dateAdded: new Date().toISOString() }]);
  };

  const markSold = (id) => {
    setSarees(sarees.map(s => s.id === id ? { ...s, status: 'sold', dateSold: new Date().toISOString() } : s));
  };

  const deleteSaree = (id) => {
    setSarees(sarees.filter(s => s.id !== id));
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Store size={32} color="#D4AF37" /> Godown
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Premium Inventory</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
            style={{ background: activeTab === 'inventory' ? 'var(--primary-gold-dim)' : 'transparent', border: 'none', textAlign: 'left', width: '100%' }}
          >
            <Store size={20} /> Inventory
          </button>
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ background: activeTab === 'dashboard' ? 'var(--primary-gold-dim)' : 'transparent', border: 'none', textAlign: 'left', width: '100%' }}
          >
            <LayoutDashboard size={20} /> Analytics
          </button>
        </nav>
      </aside>
      
      <main className="main-content animate-fade-in">
        {activeTab === 'inventory' && (
          <Inventory 
            sarees={sarees} 
            addSaree={addSaree} 
            markSold={markSold} 
            deleteSaree={deleteSaree} 
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard sarees={sarees} />
        )}
      </main>
    </div>
  );
}

export default App;
