import React, { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';

function MarkSoldModal({ saree, onClose, onConfirm }) {
  const [soldPrice, setSoldPrice] = useState(saree.rate.toString());
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!soldPrice || isNaN(soldPrice) || Number(soldPrice) <= 0) {
      setError('Please enter a valid sold price.');
      return;
    }
    onConfirm(saree.id, Number(soldPrice));
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Mark as Sold</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Selling <strong style={{ color: 'var(--text-main)' }}>{saree.modelName}</strong>
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Original rate: <span style={{ color: 'var(--primary-gold)' }}>₹{saree.rate.toLocaleString('en-IN')}</span>
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sold Price (₹) *</label>
            <div style={{ position: 'relative' }}>
              <IndianRupee size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="number"
                placeholder="Enter sold price"
                value={soldPrice}
                onChange={(e) => setSoldPrice(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                autoFocus
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MarkSoldModal;
