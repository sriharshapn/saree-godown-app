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
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        background: 'rgba(22, 21, 30, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', margin: 0 }}>
          <Store size={28} color="#D4AF37" /> Saree Collection
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Desktop search in header */}
          <div className="customer-search-desktop" style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search collection..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.8rem', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1rem 0.6rem 2.8rem', fontSize: '0.9rem' }}
            />
          </div>
          
          <button 
            onClick={onAdminClick}
            style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px', opacity: 0.5, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.5}
          >
            Admin
          </button>
        </div>
      </header>

      {/* Mobile search (hidden on desktop) */}
      <div className="customer-search-mobile" style={{ padding: '1rem 1.5rem 0', display: 'none' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search collection..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.8rem', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Count summary */}
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Showing {filteredSarees.length} saree{filteredSarees.length !== 1 ? 's' : ''} available
        </p>

        {/* Gallery */}
        {filteredSarees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <Store size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No sarees available at the moment.</p>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredSarees.map(saree => (
              <div key={saree.id} className="glass-card animate-fade-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                  {saree.imageUrl ? (
                    <img 
                      src={saree.imageUrl} 
                      alt={saree.modelName} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      loading="lazy"
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No Image
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>{saree.modelName}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                      ₹{(saree.sellingPrice || saree.costPrice || 0).toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: (saree.quantity - saree.soldQuantity) <= 2 ? '#FF6B6B' : 'var(--text-muted)' }}>
                      {saree.quantity - saree.soldQuantity} left
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleWhatsApp(saree)}
                    style={{ width: '100%', background: '#25D366', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.target.style.background = '#1DAE51'; e.target.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.target.style.background = '#25D366'; e.target.style.transform = 'translateY(0)'; }}
                  >
                    <MessageCircle size={18} /> Inquire on WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .customer-search-desktop { display: none !important; }
          .customer-search-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default CustomerView;
