import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, IndianRupee } from 'lucide-react';

function MarkSoldModal({ item, onClose, onConfirm }) {
  const availableQty = item.quantity - item.soldQuantity;
  const [sellQuantity, setSellQuantity] = useState('1');
  const [pricePerPiece, setPricePerPiece] = useState((item.sellingPrice || item.costPrice || 0).toString());
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(sellQuantity);
    const price = Number(pricePerPiece);

    if (!qty || qty < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (qty > availableQty) {
      setError(`Only ${availableQty} available to sell.`);
      return;
    }
    if (!price || price <= 0) {
      setError('Please enter a valid price per piece.');
      return;
    }

    onConfirm(item.id, price, qty);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Sell Saree</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Model: <strong style={{ color: 'var(--text-main)' }}>{item.modelName}</strong>
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          Original rate: <span style={{ color: 'var(--primary-gold)' }}>₹{(item.costPrice || 0).toLocaleString('en-IN')}</span> per piece
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Available: <strong style={{ color: 'var(--text-main)' }}>{availableQty}</strong> of {item.quantity} pieces
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-price-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Quantity to sell *</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
                min="1"
                max={availableQty}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Price per piece (₹) *</label>
              <div style={{ position: 'relative' }}>
                <IndianRupee size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  placeholder="e.g. 5500"
                  value={pricePerPiece}
                  onChange={(e) => setPricePerPiece(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
              </div>
            </div>
          </div>

          {sellQuantity && pricePerPiece && Number(sellQuantity) > 0 && Number(pricePerPiece) > 0 && (
            <div style={{ background: 'rgba(46, 139, 87, 0.1)', border: '1px solid rgba(46, 139, 87, 0.3)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total sale: </span>
              <strong style={{ color: '#4ade80', fontSize: '1.1rem' }}>₹{(Number(sellQuantity) * Number(pricePerPiece)).toLocaleString('en-IN')}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default MarkSoldModal;
