import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Tag, Loader } from 'lucide-react';
import imageCompression from 'browser-image-compression';

function EditItemModal({ item, onClose, onSave }) {
  const [modelName, setModelName] = useState(item.modelName);
  const [costPrice, setCostPrice] = useState(item.costPrice.toString());
  const [sellingPrice, setSellingPrice] = useState(item.sellingPrice.toString());
  const [salePrice, setSalePrice] = useState(item.salePrice ? item.salePrice.toString() : '');
  const [quantity, setQuantity] = useState(item.quantity.toString());
  
  // Parse existing images
  const initialImages = item.imageUrl 
    ? item.imageUrl.split(',').filter(Boolean).map(url => ({ type: 'url', url, preview: url }))
    : [];
  
  const [images, setImages] = useState(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingText, setLoadingText] = useState('');

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
    if (newImageUrl) {
      setImages(prev => [...prev, { type: 'url', url: newImageUrl, preview: newImageUrl }]);
      setNewImageUrl('');
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
    setLoadingText('Compressing images...');

    try {
      const imageDatas = [];
      const externalUrls = [];

      for (const img of images) {
        if (img.type === 'file') {
          let fileToProcess = img.file;
          try {
            // Compress aggressively to avoid apps script limits
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

      const updates = {
        modelName,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        salePrice: salePrice ? Number(salePrice) : '',
        quantity: Number(quantity),
        imageUrl: externalUrls.join(','),
        imageDatas: imageDatas.length > 0 ? imageDatas : undefined
      };

      await onSave(item.id, updates, item.category);
      setSaving(false);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to save. Please try again.');
      setSaving(false);
      setLoadingText('');
    }
  };

  const clearSalePrice = () => {
    setSalePrice('');
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Edit Item</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} disabled={saving}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1rem', color: 'var(--status-danger)', fontSize: '0.9rem' }}>
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

          <div className="modal-price-row" style={{ display: 'flex', gap: '1rem' }}>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>- optional, leave empty to remove sale</span>
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
              <p style={{ fontSize: '0.8rem', color: 'var(--status-danger)', marginTop: '0.4rem' }}>
                Customer will see ₹{Number(salePrice).toLocaleString('en-IN')} instead of <s>₹{Number(sellingPrice).toLocaleString('en-IN')}</s> - {Math.round(((Number(sellingPrice) - Number(salePrice)) / Number(sellingPrice)) * 100)}% off
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

          <div className="form-group">
            <label>Images</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={img.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} disabled={saving}>
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
                  disabled={saving}
                />
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>OR</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="https://example.com/image.jpg" 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  disabled={saving}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn-secondary" onClick={handleAddUrl} disabled={!newImageUrl || saving}>Add URL</button>
              </div>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Upload multiple images from device or paste URLs.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? loadingText : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default EditItemModal;
