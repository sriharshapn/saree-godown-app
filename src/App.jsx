import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store, RefreshCw } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import { fetchSarees, addSaree as addSareeAPI, markSareeAsSold, deleteSareeFromCloud } from './sheetsClient';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSarees = async () => {
    setLoading(true);
    try {
      const data = await fetchSarees();
      data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      setSarees(data);
    } catch (e) {
      console.error("Error fetching sarees:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSarees();
  }, []);

  const addSaree = async (saree) => {
    try {
      await addSareeAPI(saree);
      await loadSarees();
    } catch (e) {
      console.error("Error adding saree:", e);
      alert("Failed to add saree. Please try again.");
    }
  };

  const markSold = async (id) => {
    // Optimistic update for instant feedback
    setSarees(prev => prev.map(s => s.id === id ? { ...s, status: 'sold', dateSold: new Date().toISOString() } : s));
    try {
      await markSareeAsSold(id);
    } catch (e) {
      console.error("Error marking sold:", e);
      await loadSarees();
    }
  };

  const deleteSaree = async (id) => {
    // Optimistic update for instant feedback
    setSarees(prev => prev.filter(s => s.id !== id));
    try {
      await deleteSareeFromCloud(id);
    } catch (e) {
      console.error("Error deleting:", e);
      await loadSarees();
    }
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
          <button 
            className="nav-item"
            onClick={loadSarees}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', marginTop: '1rem' }}
          >
            <RefreshCw size={20} /> Refresh
          </button>
        </nav>
      </aside>
      
      <main className="main-content animate-fade-in">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--primary-gold)', borderRadius: '50%' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading inventory...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;
