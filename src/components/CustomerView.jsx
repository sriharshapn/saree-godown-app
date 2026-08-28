import React, { useState } from 'react';
import { MessageCircle, Search, Store } from 'lucide-react';
import { getDriveImageUrl } from '../sheetsClient';

function CustomerView({ inventory, onAdminClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Only show available or partial stock
  const availableItems = inventory.filter(s => s.status !== 'sold');
  
  const filteredInventory = availableItems.filter(item => {
    const matchesSearch = item.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsApp = (item) => {
    const price = (item.sellingPrice || item.costPrice || 0).toLocaleString('en-IN');
    const itemName = item.category === 'dress' ? 'Dress' : 'Saree';
    const text = encodeURIComponent(`Hi! I'm interested in this ${itemName}:\n\nModel: ${item.modelName}\nPrice: ₹${price}\n\nIs this available? I'd like to know more.`);
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
          <div className="customer-category-desktop" style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setCategoryFilter('all')} style={{ background: categoryFilter === 'all' ? 'var(--primary-gold-dim)' : 'transparent', color: categoryFilter === 'all' ? 'var(--primary-gold)' : 'var(--text-muted)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}>All</button>
            <button onClick={() => setCategoryFilter('saree')} style={{ background: categoryFilter === 'saree' ? 'var(--primary-gold-dim)' : 'transparent', color: categoryFilter === 'saree' ? 'var(--primary-gold)' : 'var(--text-muted)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}>Sarees</button>
            <button onClick={() => setCategoryFilter('dress')} style={{ background: categoryFilter === 'dress' ? 'var(--primary-gold-dim)' : 'transparent', color: categoryFilter === 'dress' ? 'var(--primary-gold)' : 'var(--text-muted)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}>Dresses</button>
          </div>

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
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button onClick={() => setCategoryFilter('all')} style={{ background: categoryFilter === 'all' ? 'var(--primary-gold-dim)' : 'transparent', color: categoryFilter === 'all' ? 'var(--primary-gold)' : 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>All</button>
          <button onClick={() => setCategoryFilter('saree')} style={{ background: categoryFilter === 'saree' ? 'var(--primary-gold-dim)' : 'transparent', color: categoryFilter === 'saree' ? 'var(--primary-gold)' : 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Sarees</button>
          <button onClick={() => setCategoryFilter('dress')} style={{ background: categoryFilter === 'dress' ? 'var(--primary-gold-dim)' : 'transparent', color: categoryFilter === 'dress' ? 'var(--primary-gold)' : 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Dresses</button>
        </div>
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
          Showing {filteredInventory.length} item{filteredInventory.length !== 1 ? 's' : ''} available
        </p>

        {/* Gallery */}
        {filteredInventory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <Store size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No inventory available at the moment.</p>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredInventory.map(item => (
              <div key={item.id} className="glass-card animate-fade-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'default' }}>
                <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                  {item.imageUrl ? (
                    <img 
                      src={getDriveImageUrl(item.imageUrl)} 
                      alt={item.modelName} 
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
                  {(item.quantity - item.soldQuantity) <= 2 && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,60,60,0.85)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Only {item.quantity - item.soldQuantity} left
                    </span>
                  )}
                </div>
                
                <div style={{ padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                    {item.modelName}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 400, textTransform: 'uppercase' }}>
                      ({item.category})
                    </span>
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {item.salePrice ? (
                        <>
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                            ₹{item.salePrice.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{(item.sellingPrice || item.costPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(255,60,60,0.15)', color: '#FF6B6B', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                            {Math.round(((item.sellingPrice - item.salePrice) / item.sellingPrice) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                          ₹{(item.sellingPrice || item.costPrice || 0).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.quantity - item.soldQuantity} in stock
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleWhatsApp(item)}
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
          .customer-category-desktop { display: none !important; }
          .customer-search-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default CustomerView;
