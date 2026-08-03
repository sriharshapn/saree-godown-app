import React from 'react';
import { IndianRupee, Trash2, CheckCircle, Clock } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
    + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function SareeCard({ saree, onMarkSold, onDelete }) {
  const isSold = saree.status === 'sold';
  const isPartial = saree.status === 'partial';
  const availableQty = saree.quantity - saree.soldQuantity;
  const profit = saree.soldPrice - (saree.soldQuantity * saree.costPrice);

  const statusLabel = isSold ? 'Sold' : isPartial ? `${saree.soldQuantity}/${saree.quantity} Sold` : 'Available';
  const badgeClass = isSold ? 'badge-success' : isPartial ? 'badge-partial' : 'badge-warning';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'relative', height: '250px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        {saree.imageUrl ? (
          <img 
            src={saree.imageUrl} 
            alt={saree.modelName} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1610189013233-3ba6804576d3?q=80&w=600&auto=format&fit=crop' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No Image
          </div>
        )}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className={`badge ${badgeClass}`}>{statusLabel}</span>
        </div>
        {saree.quantity > 1 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              Qty: {saree.quantity}
            </span>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{saree.modelName}</h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            CP: <IndianRupee size={12} style={{marginLeft: '4px'}} /> {parseFloat(saree.costPrice || 0).toLocaleString('en-IN')}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-gold)', fontSize: '1rem', fontWeight: 700 }}>
            SP: <IndianRupee size={14} style={{marginLeft: '4px'}} /> {parseFloat(saree.sellingPrice || saree.costPrice || 0).toLocaleString('en-IN')}
          </p>
        </div>

        {(isSold || isPartial) && saree.soldPrice > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(46,139,87,0.08)', padding: '0.6rem', borderRadius: '8px' }}>
            <p style={{ display: 'flex', alignItems: 'center', color: '#4ade80', fontSize: '1rem', fontWeight: 600 }}>
              <IndianRupee size={14} /> {saree.soldPrice.toLocaleString('en-IN')}
              <span style={{ fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.5rem' }}>revenue ({saree.soldQuantity} pcs)</span>
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: profit >= 0 ? '#4ade80' : '#FF6B6B' }}>
              {profit >= 0 ? '▲' : '▼'} ₹{Math.abs(profit).toLocaleString('en-IN')} {profit >= 0 ? 'profit' : 'loss'}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.3rem' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Clock size={12} /> Added: {formatDate(saree.dateAdded)}
          </p>
          {saree.dateSold && (
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Clock size={12} /> Last sold: {formatDate(saree.dateSold)}
            </p>
          )}
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
          {!isSold && (
            <button className="btn-primary" style={{ flex: 1, fontSize: '0.9rem' }} onClick={onMarkSold}>
              <CheckCircle size={16} /> Sell ({availableQty} left)
            </button>
          )}
          <button className="btn-danger" style={{ flex: isSold ? 1 : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }} onClick={onDelete} title="Delete">
            <Trash2 size={16} /> {isSold ? 'Remove' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SareeCard;
