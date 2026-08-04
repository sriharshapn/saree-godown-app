import React, { useState } from 'react';
import { X, Save, Tag } from 'lucide-react';

function EditSareeModal({ saree, onClose, onSave }) {
  const [modelName, setModelName] = useState(saree.modelName);
  const [costPrice, setCostPrice] = useState(saree.costPrice.toString());
  const [sellingPrice, setSellingPrice] = useState(saree.sellingPrice.toString());
  const [salePrice, setSalePrice] = useState(saree.salePrice ? saree.salePrice.toString() : '');
  const [quantity, setQuantity] = useState(saree.quantity.toString());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelName) {
      setError('Model name is required.');
      return;
    }
    if (!costPrice || Number(costPrice) <= 0) {
      setError('Cost price must be a valid positive number.');
      return;
    }
    if (!sellingPrice || Number(sellingPrice) <= 0) {
      setError('Selling price must be a valid positive number.');
      return;
    }
    if (salePrice && Number(salePrice) <= 0) {
      setError('Sale price must be a positive number or left empty.');
      return;
    }
    if (salePrice && Number(salePrice) >= Number(sellingPrice)) {
      setError('Sale price should be less than selling price.');
      return;
    }

    setSaving(true);
    const updates = {
      modelName,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      salePrice: salePrice ? Number(salePrice) : '',
      quantity: Number(quantity)
    };

    await onSave(saree.id, updates);
    setSaving(false);
    onClose();
  };

  const clearSalePrice = () => {
    setSalePrice('');
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Edit Saree</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1rem', color: '#FF6B6B', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Model Name *</label>
            <input 
              type="text" 
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              disabled={saving}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Cost Price (₹) *</label>
              <input 
                type="number" 
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Selling Price (₹) *</label>
              <input 
                type="number" 
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} color="#FF6B6B" /> Exclusive Sale Price (₹)
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>— optional, leave empty to remove sale</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="e.g. 3999" 
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                disabled={saving}
                style={{ borderColor: salePrice ? 'rgba(255,107,107,0.5)' : undefined }}
              />
              {salePrice && (
                <button 
                  type="button" 
                  onClick={clearSalePrice}
                  className="btn-secondary"
                  style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                >
                  Clear
                </button>
              )}
            </div>
            {salePrice && Number(sellingPrice) > 0 && (
              <p style={{ fontSize: '0.8rem', color: '#FF6B6B', marginTop: '0.4rem' }}>
                Customer will see ₹{Number(salePrice).toLocaleString('en-IN')} instead of <s>₹{Number(sellingPrice).toLocaleString('en-IN')}</s> — {Math.round(((Number(sellingPrice) - Number(salePrice)) / Number(sellingPrice)) * 100)}% off
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              disabled={saving}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSareeModal;
