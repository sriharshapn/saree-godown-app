import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Search, SquareMousePointer, X, Share2 } from 'lucide-react';
import ItemCard from './ItemCard';
import AddItemModal from './AddItemModal';
import MarkSoldModal from './MarkSoldModal';
import EditItemModal from './EditItemModal';
import ShareImagesModal from './ShareImagesModal';

function Inventory({ inventory, addItem, markSold, deleteItem, editItem }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const filteredInventory = inventory.filter(item => {
    const modelNameSafe = String(item.modelName || '');
    const matchesSearch = modelNameSafe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const selectedItems = inventory.filter(item => selectedIds.has(item.id));

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Inventory Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your beautiful collection</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className={selectionMode ? 'btn-secondary' : 'btn-secondary'}
            onClick={() => selectionMode ? exitSelectionMode() : setSelectionMode(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              border: selectionMode ? '1px solid var(--primary-gold)' : undefined,
              color: selectionMode ? 'var(--primary-gold)' : undefined,
            }}
          >
            {selectionMode ? <X size={16} /> : <SquareMousePointer size={16} />}
            {selectionMode ? 'Cancel Select' : 'Select'}
          </button>
          {!selectionMode && (
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} /> Add New Item
            </button>
          )}
        </div>
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

      {selectionMode && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '0.8rem 1.2rem', background: 'var(--primary-gold-dim)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SquareMousePointer size={16} style={{ color: 'var(--primary-gold)' }} />
          <p style={{ color: 'var(--primary-gold)', fontSize: '0.9rem', margin: 0 }}>
            Click on products to select them, then share their images.
          </p>
        </div>
      )}

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
              onMarkSold={selectionMode ? undefined : () => setItemToSell(item)} 
              onDelete={selectionMode ? undefined : () => deleteItem(item.id)}
              onEdit={selectionMode ? undefined : () => setItemToEdit(item)}
              selectionMode={selectionMode}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={() => toggleSelection(item.id)}
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

      {isShareModalOpen && (
        <ShareImagesModal
          items={selectedItems}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Floating selection action bar — rendered via portal to always stick to viewport */}
      {selectionMode && selectedIds.size > 0 && ReactDOM.createPortal(
        <div className="selection-bar">
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setSelectedIds(new Set())} style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <X size={16} /> Clear
            </button>
            <button className="btn-share" onClick={() => setIsShareModalOpen(true)} style={{ padding: '0.5rem 1.2rem' }}>
              <Share2 size={16} /> Share Images
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Inventory;

