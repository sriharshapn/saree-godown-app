import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store, RefreshCw, History, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SalesHistory from './components/SalesHistory';
import CustomerView from './components/CustomerView';
import AdminLogin from './components/AdminLogin';
import { fetchSarees, addSaree as addSareeAPI, markSareeAsSold, deleteSareeFromCloud, undoSale, editSaree as editSareeAPI } from './sheetsClient';

function App() {
  const [authMode, setAuthMode] = useState('customer'); // 'customer', 'login', 'admin'
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Instant load from localStorage cache (0ms load speed!)
  const [sarees, setSarees] = useState(() => {
    try {
      const cached = localStorage.getItem('udupu_sarees_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [sales, setSales] = useState(() => {
    try {
      const cached = localStorage.getItem('udupu_sales_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('udupu_sarees_cache');
      return !cached; // Only show spinner if no cache exists at all
    } catch (e) {
      return true;
    }
  });

  const [error, setError] = useState(null);

  // Helper to update state and sync to localStorage cache
  const updateSareesCache = (newSarees) => {
    setSarees(newSarees);
    try {
      localStorage.setItem('udupu_sarees_cache', JSON.stringify(newSarees));
    } catch (e) {
      console.warn("Could not write sarees to localStorage cache:", e);
    }
  };

  const updateSalesCache = (newSales) => {
    setSales(newSales);
    try {
      localStorage.setItem('udupu_sales_cache', JSON.stringify(newSales));
    } catch (e) {
      console.warn("Could not write sales to localStorage cache:", e);
    }
  };

  const loadSarees = async (isBackground = false) => {
    if (!isBackground && sarees.length === 0) setLoading(true);
    setError(null);
    try {
      const { sarees: fetchedSarees, sales: fetchedSales } = await fetchSarees();
      fetchedSarees.sort((a, b) => {
        const da = new Date(a.dateAdded);
        const db = new Date(b.dateAdded);
        if (isNaN(da) || isNaN(db)) return 0;
        return db - da;
      });
      updateSareesCache(fetchedSarees);
      updateSalesCache(fetchedSales);
    } catch (e) {
      console.error("Error fetching sarees:", e);
      if (sarees.length === 0) {
        setError("Could not load inventory. Please try refreshing.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSarees(sarees.length > 0);
  }, []);

  const addSaree = async (newSaree) => {
    // 1. Construct temporary saree object for INSTANT OPTIMISTIC UI display (0ms delay!)
    const tempSaree = {
      id: newSaree.id || crypto.randomUUID(),
      modelName: newSaree.modelName,
      costPrice: Number(newSaree.costPrice) || 0,
      sellingPrice: Number(newSaree.sellingPrice) || 0,
      salePrice: newSaree.salePrice ? Number(newSaree.salePrice) : null,
      quantity: Number(newSaree.quantity) || 1,
      soldQuantity: 0,
      soldPrice: 0,
      status: 'available',
      dateAdded: new Date().toISOString(),
      // If base64 image provided, display it immediately using data URL preview
      imageUrl: newSaree.imageData ? `data:image/jpeg;base64,${newSaree.imageData}` : (newSaree.imageUrl || '')
    };

    // 2. Immediately update state so it appears on screen INSTANTLY
    const updatedSarees = [tempSaree, ...sarees];
    updateSareesCache(updatedSarees);

    try {
      // 3. Send upload request to cloud in background
      await addSareeAPI(newSaree);
      
      // 4. Refetch in background after 3.5s to get official Google Drive link
      setTimeout(() => {
        loadSarees(true);
      }, 3500);
    } catch (e) {
      console.error("Error adding saree:", e);
    }
  };

  const markSold = async (id, pricePerPiece, sellQuantity) => {
    const updatedSarees = sarees.map(s => {
      if (s.id !== id) return s;
      const newSoldQty = s.soldQuantity + sellQuantity;
      const newSoldPrice = s.soldPrice + (sellQuantity * pricePerPiece);
      const newStatus = newSoldQty >= s.quantity ? 'sold' : 'partial';
      return { ...s, status: newStatus, dateSold: new Date().toISOString(), soldPrice: newSoldPrice, soldQuantity: newSoldQty };
    });
    updateSareesCache(updatedSarees);

    try {
      await markSareeAsSold(id, pricePerPiece, sellQuantity);
      loadSarees(true);
    } catch (e) {
      console.error("Error marking sold:", e);
    }
  };

  const deleteSaree = async (id) => {
    const updatedSarees = sarees.filter(s => s.id !== id);
    updateSareesCache(updatedSarees);

    try {
      await deleteSareeFromCloud(id);
    } catch (e) {
      console.error("Error deleting:", e);
    }
  };

  const handleUndoSale = async (transactionId, comment) => {
    const updatedSales = sales.map(sale => 
      sale.transactionId === transactionId ? { ...sale, status: 'undone', comment } : sale
    );
    updateSalesCache(updatedSales);

    try {
      await undoSale(transactionId, comment);
      loadSarees(true);
    } catch (e) {
      console.error("Error undoing sale:", e);
      alert("Failed to undo sale. Please try again.");
    }
  };

  const editSaree = async (id, updates) => {
    const updatedSarees = sarees.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    updateSareesCache(updatedSarees);

    try {
      await editSareeAPI(id, updates);
      loadSarees(true);
    } catch (e) {
      console.error("Error editing saree:", e);
    }
  };

  if (authMode === 'customer') {
    return (
      <>
        {loading && sarees.length === 0 ? (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
             <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--primary-gold)', borderRadius: '50%' }}></div>
           </div>
        ) : error && sarees.length === 0 ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)', color: 'var(--text-muted)' }}>
             <p>{error}</p>
             <button className="btn-primary" onClick={() => loadSarees()}>Retry</button>
           </div>
        ) : (
          <CustomerView sarees={sarees} onAdminClick={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  if (authMode === 'login') {
    return <AdminLogin onLogin={() => setAuthMode('admin')} />;
  }

  return (
    <div className="app-container animate-fade-in">
      <aside className="sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.jpg" alt="Udupu" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
            <h1 className="text-gradient" style={{ margin: 0 }}>Udupu</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Premium Saree Collection</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
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
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            style={{ background: activeTab === 'history' ? 'var(--primary-gold-dim)' : 'transparent', border: 'none', textAlign: 'left', width: '100%' }}
          >
            <History size={20} /> Sales History
          </button>
          <button 
            className="nav-item"
            onClick={loadSarees}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', marginTop: '1rem' }}
          >
            <RefreshCw size={20} /> Refresh
          </button>
        </nav>

        <button 
          className="btn-secondary"
          onClick={() => setAuthMode('customer')}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>
      
      <main className="main-content">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--primary-gold)', borderRadius: '50%' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading inventory...</p>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#FF6B6B' }}>{error}</p>
            <button className="btn-primary" onClick={loadSarees}>Try Again</button>
          </div>
        ) : (
          <>
            {activeTab === 'inventory' && (
              <Inventory 
                sarees={sarees} 
                addSaree={addSaree} 
                markSold={markSold} 
                deleteSaree={deleteSaree}
                editSaree={editSaree}
              />
            )}
            {activeTab === 'dashboard' && (
              <Dashboard sarees={sarees} sales={sales} />
            )}
            {activeTab === 'history' && (
              <SalesHistory sales={sales} onUndoSale={handleUndoSale} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
