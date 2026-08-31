import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Full-screen image lightbox portal.
 * Shows images at their natural aspect ratio, centred on a blurred dark overlay.
 * Supports keyboard (←/→/Esc) and swipe gestures.
 */
function ImageLightbox({ urls, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [touchStartX, setTouchStartX] = useState(null);

  const prev = useCallback(() => setIndex(i => (i - 1 + urls.length) % urls.length), [urls.length]);
  const next = useCallback(() => setIndex(i => (i + 1) % urls.length), [urls.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Swipe support
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    setTouchStartX(null);
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: '1rem', right: '1rem',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', borderRadius: '50%', width: '42px', height: '42px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 2001,
        }}
      >
        <X size={22} />
      </button>

      {/* Counter */}
      {urls.length > 1 && (
        <div style={{
          position: 'fixed', top: '1.1rem', left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', zIndex: 2001,
          background: 'rgba(0,0,0,0.4)', padding: '0.25rem 0.75rem', borderRadius: '20px',
        }}>
          {index + 1} / {urls.length}
        </div>
      )}

      {/* Main image — natural size, contained */}
      <img
        src={urls[index]}
        alt={`Image ${index + 1}`}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '100%',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none', // let clicks fall through to overlay to close
        }}
        draggable={false}
      />

      {/* Prev / Next arrows */}
      {urls.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{
              position: 'fixed', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', borderRadius: '50%', width: '46px', height: '46px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 2001,
            }}
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{
              position: 'fixed', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', borderRadius: '50%', width: '46px', height: '46px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 2001,
            }}
          >
            <ChevronRight size={26} />
          </button>

          {/* Dot indicators */}
          <div style={{
            position: 'fixed', bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
            left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 2001,
          }}>
            {urls.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setIndex(i); }}
                style={{
                  width: i === index ? '20px' : '8px', height: '8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: i === index ? 'var(--primary-gold)' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.25s ease', padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body
  );
}

export default ImageLightbox;
