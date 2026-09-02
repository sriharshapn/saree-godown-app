import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Loader, Tag, Plus } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { SCRIPT_URL } from '../sheetsClient';

function AddItemModal({ onClose, onAdd, defaultCategory = 'saree' }) {
  const [modelName, setModelName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [category, setCategory] = useState(defaultCategory);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      type: 'file',
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleAddUrl = () => {
    if (imageUrl) {
      setImages(prev => [...prev, { type: 'url', url: imageUrl, preview: imageUrl }]);
      setImageUrl('');
    }
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!modelName || !costPrice || !sellingPrice) {
      setError('Model Name, Cost Price, and Selling Price are required.');
      return;
    }
    if (isNaN(costPrice) || Number(costPrice) <= 0 || isNaN(sellingPrice) || Number(sellingPrice) <= 0) {
      setError('Prices must be valid positive numbers.');
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
    if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setLoading(true);
    setLoadingText('Compressing images...');

    try {
      const imageDatas = [];
      const externalUrls = [];

      for (const img of images) {
        if (img.type === 'file') {
          let fileToProcess = img.file;
          try {
            // Compress very aggressively — 50KB max so all images fit in one request
            fileToProcess = await imageCompression(img.file, {
              maxSizeMB: 0.05,
              maxWidthOrHeight: 500,
              useWebWorker: false,
              initialQuality: 0.4
            });
          } catch (compressionError) {
            console.warn('Compression failed, using original', compressionError);
          }
          const base64 = await fileToBase64(fileToProcess);
          imageDatas.push(base64);
        } else {
          externalUrls.push(img.url);
        }
      }

      setLoadingText('Saving...');
      const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      const id = generateId();

      await onAdd({
        id,
        modelName,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        salePrice: salePrice ? Number(salePrice) : null,
        quantity: Number(quantity),
        imageUrl: externalUrls.join(','),
        imageDatas: imageDatas.length > 0 ? imageDatas : undefined,
        category
      });

      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to save. Please try again.');
      setLoading(false);
      setLoadingText('');
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Add New Item</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} disabled={loading}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category *</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', marginBottom: '1rem' }}
            >
              <option value="saree">Saree</option>
              <option value="dress">Dress</option>
            </select>
          </div>

          <div className="form-group">
            <label>Model Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Kanchipuram Silk" 
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="modal-price-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Cost Price (₹) *</label>
              <input 
                type="number" 
                placeholder="e.g. 3000" 
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Selling Price (₹) *</label>
              <input 
                type="number" 
                placeholder="e.g. 5000" 
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} color="#FF6B6B" /> Exclusive Sale Price (₹)
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>- optional</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="e.g. 3999" 
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                disabled={loading}
                style={{ borderColor: salePrice ? 'rgba(255,107,107,0.5)' : undefined }}
              />
              {salePrice && (
                <button 
                  type="button" 
                  onClick={() => setSalePrice('')}
                  className="btn-secondary"
                  style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input 
              type="number" 
              placeholder="e.g. 10" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Images</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={img.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleImageUpload}
                  style={{ padding: '0.6rem', width: '100%', fontSize: '0.85rem' }}
                  disabled={loading}
                />
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>OR</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="https://example.com/image.jpg" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn-secondary" onClick={handleAddUrl} disabled={!imageUrl || loading}>Add URL</button>
              </div>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Upload multiple images from device or paste URLs.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? loadingText : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default AddItemModal;
