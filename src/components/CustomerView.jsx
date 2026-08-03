import React, { useState } from 'react';
import { MessageCircle, Search, Store } from 'lucide-react';

function CustomerView({ sarees, onAdminClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Only show available or partial stock
  const availableSarees = sarees.filter(s => s.status !== 'sold');
  
  const filteredSarees = availableSarees.filter(s => 
    s.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsApp = (saree) => {
    const text = encodeURIComponent(`Hi! I'm interested in the Saree: ${saree.modelName}. Is it available?`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Header */}
      <header style={{ padding: '1.5rem 2rem', background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', margin: 0 }}>
          <Store size={28} color="#D4AF37" /> Saree Collection
        </h1>
        
        {/* Hidden admin button - users can double click the search icon or just click a small discreet button */}
        <button 
          onClick={onAdminClick}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.5 }}
        >
          Admin
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search our collection..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '3rem', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Gallery */}
        {filteredSarees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No sarees available at the moment.</p>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredSarees.map(saree => (
              <div key={saree.id} className="glass-card animate-fade-in" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', background: '#111' }}>
                  {saree.imageUrl ? (
                    <img 
                      src={saree.imageUrl} 
                      alt={saree.modelName} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No Image
                    </div>
                  )}
                </div>
                
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{saree.modelName}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                    ₹{saree.sellingPrice?.toLocaleString('en-IN') || saree.costPrice?.toLocaleString('en-IN') || 0}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {saree.quantity - saree.soldQuantity} available
                  </span>
                </div>
                
                <button 
                  onClick={() => handleWhatsApp(saree)}
                  style={{ width: '100%', background: '#25D366', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}
                >
                  <MessageCircle size={20} /> Inquire on WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerView;
