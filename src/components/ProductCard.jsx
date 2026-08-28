import React, { useState } from 'react';
import { getDriveImageUrl } from '../sheetsClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ProductCard({ item, onWhatsAppClick }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const rawImageUrls = item.imageUrl ? item.imageUrl.split(',').filter(Boolean) : [];
  // For data URIs (local optimistic UI) vs Drive URLs
  const imageUrls = rawImageUrls.map(url => getDriveImageUrl(url));
  const hasImages = imageUrls.length > 0;
  const isMultiple = imageUrls.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="saree-card animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '133%' /* 3:4 aspect ratio */, backgroundColor: '#111' }}>
        {hasImages ? (
          <>
            <img 
              src={imageUrls[currentImgIndex]} 
              alt={item.modelName}
              loading="lazy"
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
              }}
            />
            {isMultiple && (
              <>
                <button 
                  onClick={prevImage}
                  style={{
                    position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 2
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  style={{
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 2
                  }}
                >
                  <ChevronRight size={20} />
                </button>
                <div style={{
                  position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 2
                }}>
                  {imageUrls.map((_, idx) => (
                    <div 
                      key={idx}
                      style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: idx === currentImgIndex ? 'var(--primary-gold)' : 'rgba(255,255,255,0.5)',
                        transition: 'background 0.3s'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' 
          }}>
            No Image
          </div>
        )}
        
        {item.quantity === 0 && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            background: '#FF6B6B', color: 'white', padding: '4px 12px',
            borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2
          }}>
            SOLD OUT
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'white', lineHeight: 1.3 }}>{item.modelName}</h3>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '1rem' }}>
          {item.salePrice ? (
            <>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                ₹{item.salePrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{item.sellingPrice.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
              ₹{item.sellingPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button 
          className="btn-primary" 
          onClick={() => onWhatsAppClick(item)}
          disabled={item.quantity === 0}
          style={{ width: '100%', marginTop: 'auto' }}
        >
          {item.quantity === 0 ? 'Out of Stock' : 'Enquire on WhatsApp'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
