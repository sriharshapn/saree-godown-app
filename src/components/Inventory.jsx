import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import SareeCard from './SareeCard';
import AddSareeModal from './AddSareeModal';
import MarkSoldModal from './MarkSoldModal';

function Inventory({ sarees, addSaree, markSold, deleteSaree }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sareeToSell, setSareeToSell] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredSarees = sarees.filter(saree => {
    const matchesSearch = saree.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || saree.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Inventory Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your beautiful saree collection</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} /> Add New Saree
        </button>
      </div>

      <div className="glass-card flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by model name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '150px' }}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {filteredSarees.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No sarees found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredSarees.map(saree => (
            <SareeCard 
              key={saree.id} 
              saree={saree} 
              onMarkSold={() => setSareeToSell(saree)} 
              onDelete={() => deleteSaree(saree.id)} 
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddSareeModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={addSaree} 
        />
      )}

      {sareeToSell && (
        <MarkSoldModal
          saree={sareeToSell}
          onClose={() => setSareeToSell(null)}
          onConfirm={(id, soldPrice) => {
            markSold(id, soldPrice);
            setSareeToSell(null);
          }}
        />
      )}
    </div>
  );
}

export default Inventory;
