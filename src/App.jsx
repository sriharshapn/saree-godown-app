import React, { useState, useEffect } from 'react';
import udupuLogo from './assets/logo.png';
import { LayoutDashboard, Store, RefreshCw, History, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SalesHistory from './components/SalesHistory';
import CustomerView from './components/CustomerView';
import AdminLogin from './components/AdminLogin';
import { fetchInventory, addItem as addItemAPI, markItemAsSold, deleteItemFromCloud, undoSale, editItem as editItemAPI } from './sheetsClient';

function App() {
  const [authMode, setAuthMode] = useState('customer'); // 'customer', 'login', 'admin'
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Instant load from localStorage cache (0ms load speed!)
  const [inventory, setInventory] = useState(() => {
    try {
      const cached = localStorage.getItem('udupu_inventory_cache');
      // Migrate old cache if exists
      if (!cached) {
        const oldCache = localStorage.getItem('udupu_sarees_cache');
        if (oldCache) return JSON.parse(oldCache);
      }
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
      const cached = localStorage.getItem('udupu_inventory_cache') || localStorage.getItem('udupu_sarees_cache');
      return !cached; // Only show spinner if no cache exists at all
    } catch (e) {
      return true;
    }
  });

  const [error, setError] = useState(null);

  // Helper to update state and sync to localStorage cache
  const updateInventoryCache = (newInventory) => {
    setInventory(newInventory);
    try {
      localStorage.setItem('udupu_inventory_cache', JSON.stringify(newInventory));
    } catch (e) {
      console.warn("Could not write inventory to localStorage cache:", e);
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

  const loadInventory = async (isBackground = false) => {
    if (!isBackground && inventory.length === 0) setLoading(true);
    setError(null);
    try {
      const { inventory: fetchedInventory, sales: fetchedSales } = await fetchInventory();
      fetchedInventory.sort((a, b) => {
        const da = new Date(a.dateAdded);
        const db = new Date(b.dateAdded);
        if (isNaN(da) || isNaN(db)) return 0;
        return db - da;
      });
      updateInventoryCache(fetchedInventory);
      updateSalesCache(fetchedSales);
    } catch (e) {
      console.error("Error fetching inventory:", e);
      if (inventory.length === 0) {
        setError("Could not load inventory. Please try refreshing.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory(inventory.length > 0);
  }, []);

  const addItem = async (newItem) => {
    // 1. Construct temporary item object for INSTANT OPTIMISTIC UI display
    const tempItem = {
      id: newItem.id || crypto.randomUUID(),
      modelName: newItem.modelName,
      costPrice: Number(newItem.costPrice) || 0,
      sellingPrice: Number(newItem.sellingPrice) || 0,
      salePrice: newItem.salePrice ? Number(newItem.salePrice) : null,
      quantity: Number(newItem.quantity) || 1,
      soldQuantity: 0,
      soldPrice: 0,
      status: 'available',
      dateAdded: new Date().toISOString(),
      category: newItem.category || 'saree',
      // If base64 image provided, display it immediately using data URL preview
      imageUrl: newItem.imageData ? `data:image/jpeg;base64,${newItem.imageData}` : (newItem.imageUrl || '')
    };

    // 2. Immediately update state so it appears on screen INSTANTLY
    const updatedInventory = [tempItem, ...inventory];
    updateInventoryCache(updatedInventory);

    try {
      // 3. Send upload request to cloud in background
      const res = await addItemAPI(tempItem);
      if (res && res.success === false) {
        alert("Failed to add item: " + (res.error || "Unknown error. Did you forget to deploy the new Google Apps Script?"));
      }
      
      // 4. Refetch in background after 3.5s to get official Google Drive link
      setTimeout(() => {
        loadInventory(true);
      }, 3500);
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  const markSold = async (id, pricePerPiece, sellQuantity) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const updatedInventory = inventory.map(s => {
      if (s.id !== id) return s;
      const newSoldQty = s.soldQuantity + sellQuantity;
      const newSoldPrice = s.soldPrice + (sellQuantity * pricePerPiece);
      const newStatus = newSoldQty >= s.quantity ? 'sold' : 'partial';
      return { ...s, status: newStatus, dateSold: new Date().toISOString(), soldPrice: newSoldPrice, soldQuantity: newSoldQty };
    });
    updateInventoryCache(updatedInventory);

    try {
      await markItemAsSold(id, pricePerPiece, sellQuantity, item.category);
      loadInventory(true);
    } catch (e) {
      console.error("Error marking sold:", e);
    }
  };

  const deleteItem = async (id) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const updatedInventory = inventory.filter(s => s.id !== id);
    updateInventoryCache(updatedInventory);

    try {
      await deleteItemFromCloud(id, item.category);
    } catch (e) {
      console.error("Error deleting:", e);
    }
  };

  const handleUndoSale = async (transactionId, comment) => {
    const sale = sales.find(s => s.transactionId === transactionId);
    if (!sale) return;

    const item = inventory.find(i => i.id === sale.sareeId); // The backend still uses sareeId as the column header
    const category = item ? item.category : 'saree'; // Fallback if deleted

    const updatedSales = sales.map(s => 
      s.transactionId === transactionId ? { ...s, status: 'undone', comment } : s
    );
    updateSalesCache(updatedSales);

    try {
      await undoSale(transactionId, comment, category);
      loadInventory(true);
    } catch (e) {
      console.error("Error undoing sale:", e);
      alert("Failed to undo sale. Please try again.");
    }
  };

  const editItem = async (id, updates, category) => {
    const updatedInventory = inventory.map(s => 
      s.id === id ? { ...s, ...updates, category } : s
    );
    updateInventoryCache(updatedInventory);

    try {
      const res = await editItemAPI(id, updates, category);
      if (res && res.success === false) {
        alert("Failed to edit item: " + (res.error || "Unknown error. Did you forget to deploy the new Google Apps Script?"));
      }
      loadInventory(true);
    } catch (e) {
      console.error("Error editing item:", e);
      alert("Error saving edit. Please check your connection.");
    }
  };

  if (authMode === 'customer') {
    return (
      <>
        {loading && inventory.length === 0 ? (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
             <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--primary-gold)', borderRadius: '50%' }}></div>
           </div>
        ) : error && inventory.length === 0 ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)', color: 'var(--text-muted)' }}>
             <p>{error}</p>
             <button className="btn-primary" onClick={() => loadInventory()}>Retry</button>
           </div>
        ) : (
          <CustomerView inventory={inventory} onAdminClick={() => setAuthMode('login')} />
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
            <img src={udupuLogo} alt="Udupu" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
            <h1 className="text-gradient" style={{ margin: 0 }}>Udupu</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Premium Saree & Dress Collection</p>
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
            onClick={loadInventory}
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
            <button className="btn-primary" onClick={loadInventory}>Try Again</button>
          </div>
        ) : (
          <>
            {activeTab === 'inventory' && (
              <Inventory 
                inventory={inventory} 
                addItem={addItem} 
                markSold={markSold} 
                deleteItem={deleteItem}
                editItem={editItem}
              />
            )}
            {activeTab === 'dashboard' && (
              <Dashboard inventory={inventory} sales={sales} />
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
