import React from 'react';
import { IndianRupee, Trash2, CheckCircle } from 'lucide-react';

function SareeCard({ saree, onMarkSold, onDelete }) {
  const isSold = saree.status === 'sold';
  const soldPrice = Number(saree.soldPrice) || 0;
  const profit = soldPrice - saree.rate;

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
          <span className={`badge ${isSold ? 'badge-success' : 'badge-warning'}`}>
            {isSold ? 'Sold' : 'Available'}
          </span>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{saree.modelName}</h3>
        <p style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-gold)', fontSize: '1.1rem', fontWeight: 700 }}>
          <IndianRupee size={16} /> {parseFloat(saree.rate).toLocaleString('en-IN')}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            {isSold ? '(Original)' : '(Rate)'}
          </span>
        </p>

        {isSold && soldPrice > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', color: '#4ade80', fontSize: '1.1rem', fontWeight: 700 }}>
              <IndianRupee size={16} /> {soldPrice.toLocaleString('en-IN')}
              <span style={{ fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Sold)</span>
            </p>
            <p style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600,
              color: profit >= 0 ? '#4ade80' : '#FF6B6B' 
            }}>
              {profit >= 0 ? '▲' : '▼'} ₹{Math.abs(profit).toLocaleString('en-IN')} {profit >= 0 ? 'profit' : 'loss'}
            </p>
          </div>
        )}
        
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
          {!isSold && (
            <button className="btn-primary" style={{ flex: 1 }} onClick={onMarkSold}>
              <CheckCircle size={18} /> Mark Sold
            </button>
          )}
          <button className="btn-danger" style={{ flex: isSold ? 1 : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }} onClick={onDelete} title="Delete">
            <Trash2 size={18} /> {isSold ? 'Remove' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SareeCard;
