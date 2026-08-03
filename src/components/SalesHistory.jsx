import React, { useState } from 'react';
import { Clock, RotateCcw, X, MessageSquare, CheckCircle } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
    + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function UndoModal({ sale, onClose, onConfirm }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(sale.transactionId, comment);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Undo Sale</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          You are about to undo the sale of <strong>{sale.quantitySold} x {sale.modelName}</strong>.
        </p>
        <p style={{ color: '#FF6B6B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This will restore the quantity to the inventory and deduct ₹{sale.totalPrice.toLocaleString('en-IN')} from your revenue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for undoing (Optional)</label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <textarea 
                placeholder="e.g. Customer returned, entered by mistake..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ paddingLeft: '2.2rem', minHeight: '80px', width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-danger" style={{ flex: 1 }}>
              Confirm Undo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SalesHistory({ sales, onUndoSale }) {
  const [saleToUndo, setSaleToUndo] = useState(null);

  // Sort sales latest first
  const sortedSales = [...sales].sort((a, b) => {
    const da = new Date(a.dateSold);
    const db = new Date(b.dateSold);
    if (isNaN(da) || isNaN(db)) return 0;
    return db - da;
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Sales History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track all your sales and undo if necessary</p>
      </div>

      {sortedSales.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No sales recorded yet.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Model</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Qty</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Price</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedSales.map((sale) => (
                <tr key={sale.transactionId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: sale.status === 'undone' ? 0.6 : 1 }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Clock size={14} color="var(--text-muted)" /> {formatDate(sale.dateSold)}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{sale.modelName}</td>
                  <td style={{ padding: '1rem' }}>{sale.quantitySold}</td>
                  <td style={{ padding: '1rem', color: '#4ade80', fontWeight: 600 }}>₹{sale.totalPrice.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '1rem' }}>
                    {sale.status === 'undone' ? (
                      <div>
                        <span className="badge" style={{ background: 'rgba(255,107,107,0.2)', color: '#FF6B6B' }}>Undone</span>
                        {sale.comment && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>"{sale.comment}"</div>}
                      </div>
                    ) : (
                      <span className="badge badge-success"><CheckCircle size={12} style={{marginRight: '4px'}}/> Completed</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {sale.status !== 'undone' && (
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                        onClick={() => setSaleToUndo(sale)}
                      >
                        <RotateCcw size={14} /> Undo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {saleToUndo && (
        <UndoModal 
          sale={saleToUndo} 
          onClose={() => setSaleToUndo(null)} 
          onConfirm={(id, comment) => {
            onUndoSale(id, comment);
            setSaleToUndo(null);
          }}
        />
      )}
    </div>
  );
}

export default SalesHistory;
