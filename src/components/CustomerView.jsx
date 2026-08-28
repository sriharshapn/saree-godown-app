import React, { useState } from 'react';
import udupuLogo from '../assets/logo.png';
import { MessageCircle, Search, Store, Phone, MapPin, Globe } from 'lucide-react';
import { getDriveImageUrl } from '../sheetsClient';

const WHATSAPP_NUMBER = '916360718575';
const SHOP_NAME = 'Harvish Training Center and Boutique';
const SHOP_ADDRESS_1 = 'Akshaya Nilayam, Plot No 1,';
const SHOP_ADDRESS_2 = 'Kappagal Rd, behind Tirumala Hospital,';
const SHOP_ADDRESS_3 = 'Ballari — 583101, Karnataka';
const SHOP_WEBSITE = 'https://harvishtrainingcenter.com';
const SHOP_PHONE = '+91 63607 18575';

function CustomerView({ inventory, onAdminClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const availableItems = inventory.filter(s => s.status !== 'sold');

  const filteredInventory = availableItems.filter(item => {
    const modelNameSafe = String(item.modelName || '');
    const matchesSearch = modelNameSafe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsApp = (item) => {
    const price = (item.salePrice || item.sellingPrice || item.costPrice || 0).toLocaleString('en-IN');
    const itemType = item.category === 'dress' ? 'Dress' : 'Saree';
    const text = encodeURIComponent(
      `Hi! I'm interested in this ${itemType} from ${SHOP_NAME}:\n\nModel: ${item.modelName}\nPrice: ₹${price}\n\nIs this available? I'd like to know more.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const CategoryBtn = ({ value, label }) => (
    <button
      onClick={() => setCategoryFilter(value)}
      style={{
        background: categoryFilter === value ? 'var(--primary-gold-dim)' : 'transparent',
        color: categoryFilter === value ? 'var(--primary-gold)' : 'var(--text-muted)',
        border: `1px solid ${categoryFilter === value ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
        padding: '0.4rem 1.1rem',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontWeight: 500,
        fontFamily: 'Outfit, sans-serif',
        whiteSpace: 'nowrap',
        transition: 'all 0.25s ease',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sticky glass header ── */}
      <header style={{
        padding: '0 2rem',
        height: '72px',
        background: 'rgba(22, 21, 30, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <img src={udupuLogo} alt="Logo" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.35)' }} />
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.4rem', margin: 0, lineHeight: 1.1 }}>Udupu</h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              by Harvish Boutique
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="customer-nav-desktop" style={{ display: 'flex', gap: '0.4rem' }}>
          <CategoryBtn value="all" label="All" />
          <CategoryBtn value="saree" label="Sarees" />
          <CategoryBtn value="dress" label="Dresses" />
        </nav>

        {/* Desktop search + admin */}
        <div className="customer-search-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '2.4rem',
                paddingRight: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderRadius: '30px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.88rem',
                width: '200px',
                color: 'var(--text-main)',
                fontFamily: 'Outfit, sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary-gold)'; e.target.style.boxShadow = '0 0 0 2px var(--primary-gold-dim)'; e.target.style.width = '260px'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.width = '200px'; }}
            />
          </div>
          <button
            onClick={onAdminClick}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontFamily: 'Outfit, sans-serif',
              opacity: 0.5,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
          >
            Admin
          </button>
        </div>
      </header>

      {/* ── Mobile: category tabs + search ── */}
      <div className="customer-mobile-controls" style={{ display: 'none', padding: '1rem 1rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
          <CategoryBtn value="all" label="All" />
          <CategoryBtn value="saree" label="Sarees" />
          <CategoryBtn value="dress" label="Dresses" />
        </div>
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Outfit, sans-serif' }}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Showing <strong style={{ color: 'var(--text-main)' }}>{filteredInventory.length}</strong> item{filteredInventory.length !== 1 ? 's' : ''} available
        </p>

        {filteredInventory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <Store size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No items available right now.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Check back soon or contact us on WhatsApp.</p>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredInventory.map(item => {
              const availQty = item.quantity - item.soldQuantity;
              const isLowStock = availQty <= 2;
              const displayPrice = item.salePrice || item.sellingPrice || item.costPrice || 0;

              return (
                <article
                  key={item.id}
                  className="glass-card animate-fade-in customer-product-card"
                  style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  {/* Image area */}
                  <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                    {item.imageUrl ? (
                      <img
                        src={getDriveImageUrl(item.imageUrl)}
                        alt={item.modelName}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No Image
                      </div>
                    )}

                    {/* Stock badge */}
                    <span style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: isLowStock ? 'rgba(255,60,60,0.85)' : 'rgba(46,139,87,0.25)',
                      color: isLowStock ? '#fff' : '#4ade80',
                      border: isLowStock ? 'none' : '1px solid rgba(46,139,87,0.4)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {isLowStock ? `Only ${availQty} left` : 'Available'}
                    </span>

                    {/* Sale badge */}
                    {item.salePrice && (
                      <span style={{
                        position: 'absolute', bottom: '10px', left: '10px',
                        background: 'rgba(255,60,60,0.9)', color: '#fff',
                        padding: '0.2rem 0.6rem', borderRadius: '6px',
                        fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                      {item.category === 'dress' ? 'Dress' : 'Saree'}
                    </p>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {item.modelName}
                    </h3>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                      {item.salePrice ? (
                        <>
                          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FF6B6B' }}>
                            ₹{item.salePrice.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{(item.sellingPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(255,60,60,0.12)', color: '#FF6B6B', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                            {Math.round(((item.sellingPrice - item.salePrice) / item.sellingPrice) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-gold)' }}>
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {availQty} in stock
                      </span>
                    </div>

                    {/* WhatsApp CTA */}
                    <button
                      onClick={() => handleWhatsApp(item)}
                      className="whatsapp-btn"
                      style={{
                        width: '100%',
                        background: '#25D366',
                        color: '#fff',
                        border: 'none',
                        padding: '0.72rem',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: 'auto',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.88rem',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1DAE51'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <MessageCircle size={16} />
                      Inquire on WhatsApp
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)',
        padding: '3rem 2rem 2rem',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2rem' }}>

            {/* Brand col */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <img src={udupuLogo} alt="Logo" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.35)' }} />
                <h2 className="text-gradient" style={{ fontSize: '1.4rem', margin: 0 }}>Udupu</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                A curated collection of premium sarees and dresses from {SHOP_NAME}.
              </p>
            </div>

            {/* Contact col */}
            <div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', marginTop: 0 }}>Contact Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#25D366', fontSize: '0.88rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  <MessageCircle size={15} /> {SHOP_PHONE}
                </a>
                <a
                  href={`tel:${SHOP_PHONE}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none' }}
                >
                  <Phone size={15} /> {SHOP_PHONE}
                </a>
                <a
                  href={SHOP_WEBSITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-gold)', fontSize: '0.88rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  <Globe size={15} /> harvishtrainingcenter.com
                </a>
              </div>
            </div>

            {/* Address col */}
            <div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', marginTop: 0 }}>Visit Us</h3>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={15} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <address style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, fontStyle: 'normal', margin: 0 }}>
                  {SHOP_ADDRESS_1}<br />
                  {SHOP_ADDRESS_2}<br />
                  {SHOP_ADDRESS_3}
                </address>
              </div>
            </div>

            {/* Hours col */}
            <div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', marginTop: 0 }}>Opening Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { day: 'Mon – Fri', time: '10:00 AM – 8:00 PM' },
                  { day: 'Saturday', time: '10:00 AM – 8:00 PM' },
                  { day: 'Sunday', time: 'Closed' },
                ].map(({ day, time }) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{day}</span>
                    <span style={{ color: time === 'Closed' ? '#FF6B6B' : 'var(--text-main)', fontSize: '0.82rem', fontWeight: 500 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.
            </p>
            <a
              href={SHOP_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              harvishtrainingcenter.com
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .customer-nav-desktop { display: none !important; }
          .customer-search-desktop { display: none !important; }
          .customer-mobile-controls { display: block !important; }
        }
        .customer-product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .customer-product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.18);
          border-color: rgba(212, 175, 55, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

export default CustomerView;
