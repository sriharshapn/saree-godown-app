import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import { db } from './firebaseClient';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sarees'), (snapshot) => {
      const sareesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      sareesData.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      setSarees(sareesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sarees: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addSaree = async (saree) => {
    try {
      await addDoc(collection(db, 'sarees'), {
        ...saree,
        status: 'available',
        dateAdded: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding saree: ", e);
      alert("Failed to add Saree to Cloud Database.");
    }
  };

  const markSold = async (id) => {
    try {
      const sareeRef = doc(db, 'sarees', id);
      await updateDoc(sareeRef, {
        status: 'sold',
        dateSold: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error marking sold: ", e);
    }
  };

  const deleteSaree = async (id) => {
    try {
      await deleteDoc(doc(db, 'sarees', id));
    } catch (e) {
      console.error("Error deleting: ", e);
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
        </nav>
      </aside>
      
      <main className="main-content animate-fade-in">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading inventory from cloud...</p>
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
