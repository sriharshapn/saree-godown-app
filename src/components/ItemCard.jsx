import React from 'react';
import { IndianRupee, Trash2, CheckCircle, Clock, Pencil, Tag } from 'lucide-react';
import { getDriveImageUrl } from '../sheetsClient';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
    + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function ItemCard({ item, onMarkSold, onDelete, onEdit }) {
  const isSold = item.status === 'sold';
  const isPartial = item.status === 'partial';
  const availableQty = item.quantity - item.soldQuantity;
  const profit = item.soldPrice - (item.soldQuantity * item.costPrice);

  const statusLabel = isSold ? 'Sold' : isPartial ? `${item.soldQuantity}/${item.quantity} Sold` : 'Available';
  const badgeClass = isSold ? 'badge-success' : isPartial ? 'badge-partial' : 'badge-warning';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'relative', height: '250px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        {item.imageUrl ? (
          <img 
            src={getDriveImageUrl(item.imageUrl)} 
            alt={item.modelName} 
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
        {item.quantity > 1 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              Qty: {item.quantity}
            </span>
          </div>
        )}
        {item.salePrice && (
          <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
            <span className="badge" style={{ background: 'rgba(255,60,60,0.9)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={10} /> SALE
            </span>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
          {item.modelName} 
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px', fontWeight: 400, textTransform: 'uppercase' }}>
            ({item.category})
          </span>
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            CP: <IndianRupee size={12} style={{marginLeft: '4px'}} /> {parseFloat(item.costPrice || 0).toLocaleString('en-IN')}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-gold)', fontSize: '1rem', fontWeight: 700 }}>
            SP: <IndianRupee size={14} style={{marginLeft: '4px'}} /> {parseFloat(item.sellingPrice || item.costPrice || 0).toLocaleString('en-IN')}
          </p>
        </div>

        {(isSold || isPartial) && item.soldPrice > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(46,139,87,0.08)', padding: '0.6rem', borderRadius: '8px' }}>
            <p style={{ display: 'flex', alignItems: 'center', color: '#4ade80', fontSize: '1rem', fontWeight: 600 }}>
              <IndianRupee size={14} /> {item.soldPrice.toLocaleString('en-IN')}
              <span style={{ fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.5rem' }}>revenue ({item.soldQuantity} pcs)</span>
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: profit >= 0 ? '#4ade80' : '#FF6B6B' }}>
              {profit >= 0 ? '▲' : '▼'} ₹{Math.abs(profit).toLocaleString('en-IN')} {profit >= 0 ? 'profit' : 'loss'}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.3rem' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Clock size={12} /> Added: {formatDate(item.dateAdded)}
          </p>
          {item.dateSold && (
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Clock size={12} /> Last sold: {formatDate(item.dateSold)}
            </p>
          )}
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
          {!isSold && (
            <button className="btn-primary" style={{ flex: 1, fontSize: '0.9rem' }} onClick={onMarkSold}>
              <CheckCircle size={16} /> Mark Sold (Qty: {availableQty})
            </button>
          )}
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem 0.6rem' }} onClick={onEdit} title="Edit">
            <Pencil size={16} />
          </button>
          <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }} onClick={onDelete} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
