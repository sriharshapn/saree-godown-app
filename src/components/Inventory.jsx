import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import ItemCard from './ItemCard';
import AddItemModal from './AddItemModal';
import MarkSoldModal from './MarkSoldModal';
import EditItemModal from './EditItemModal';

function Inventory({ inventory, addItem, markSold, deleteItem, editItem }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Inventory Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your beautiful collection</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} /> Add New Item
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
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: '150px' }}>
            <option value="all">All Categories</option>
            <option value="saree">Sarees</option>
            <option value="dress">Dresses</option>
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '150px' }}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {filteredInventory.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No inventory found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredInventory.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onMarkSold={() => setItemToSell(item)} 
              onDelete={() => deleteItem(item.id)}
              onEdit={() => setItemToEdit(item)}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddItemModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={addItem} 
        />
      )}

      {itemToSell && (
        <MarkSoldModal
          item={itemToSell}
          onClose={() => setItemToSell(null)}
          onConfirm={(id, pricePerPiece, sellQuantity) => {
            markSold(id, pricePerPiece, sellQuantity);
            setItemToSell(null);
          }}
        />
      )}

      {itemToEdit && (
        <EditItemModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSave={editItem}
        />
      )}
    </div>
  );
}

export default Inventory;
