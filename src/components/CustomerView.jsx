import React, { useState } from 'react';
import { MessageCircle, Search, Store } from 'lucide-react';
import { getDriveImageUrl } from '../sheetsClient';

function CustomerView({ sarees, onAdminClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Only show available or partial stock
  const availableSarees = sarees.filter(s => s.status !== 'sold');
  
  const filteredSarees = availableSarees.filter(s => 
    s.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsApp = (saree) => {
    const price = (saree.sellingPrice || saree.costPrice || 0).toLocaleString('en-IN');
    const text = encodeURIComponent(`Hi! I'm interested in the Saree:\n\nModel: ${saree.modelName}\nPrice: ₹${price}\n\nIs this available? I'd like to know more.`);
    window.open(`https://wa.me/916360718575?text=${text}`, '_blank');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpg" alt="Udupu" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <h1 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>Udupu</h1>
        </div>

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
              <div key={saree.id} className="glass-card animate-fade-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'default' }}>
                <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                  {saree.imageUrl ? (
                    <img 
                      src={getDriveImageUrl(saree.imageUrl)} 
                      alt={saree.modelName} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      loading="lazy"
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No Image
                    </div>
                  )}
                  {(saree.quantity - saree.soldQuantity) <= 2 && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,60,60,0.85)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Only {saree.quantity - saree.soldQuantity} left
                    </span>
                  )}
                </div>
                
                <div style={{ padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{saree.modelName}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {saree.salePrice ? (
                        <>
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                            ₹{saree.salePrice.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{(saree.sellingPrice || saree.costPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(255,60,60,0.15)', color: '#FF6B6B', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                            {Math.round(((saree.sellingPrice - saree.salePrice) / saree.sellingPrice) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                          ₹{(saree.sellingPrice || saree.costPrice || 0).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {saree.quantity - saree.soldQuantity} in stock
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleWhatsApp(saree)}
                    style={{ width: '100%', background: '#25D366', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1DAE51'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <MessageCircle size={16} /> Inquire on WhatsApp
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
