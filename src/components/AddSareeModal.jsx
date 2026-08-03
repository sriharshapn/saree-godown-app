import React, { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import imageCompression from 'browser-image-compression';

function AddSareeModal({ onClose, onAdd }) {
  const [modelName, setModelName] = useState('');
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
    }
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
    if (!modelName || !rate) {
      setError('Model Name and Rate are required.');
      return;
    }
    if (isNaN(rate) || Number(rate) <= 0) {
      setError('Please enter a valid rate.');
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageData = null;
      let finalImageUrl = imageUrl;

      if (imageFile) {
        setLoadingText('Compressing image...');
        const compressed = await imageCompression(imageFile, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          initialQuality: 0.6
        });

        setLoadingText('Preparing upload...');
        imageData = await fileToBase64(compressed);
        finalImageUrl = '';
      }

      setLoadingText('Saving to cloud...');
      const id = crypto.randomUUID();

      await onAdd({
        id,
        modelName,
        rate: Number(rate),
        quantity: Number(quantity),
        imageUrl: finalImageUrl || '',
        imageData
      });

      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to save. Please try again.");
      setLoading(false);
      setLoadingText('');
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Add New Saree</h2>
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
            <label>Model Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Kanchipuram Silk" 
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Rate per piece (₹) *</label>
              <input 
                type="number" 
                placeholder="e.g. 5000" 
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
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
          </div>

          <div className="form-group">
            <label>Image (Camera / Gallery or URL)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageUpload}
                style={{ padding: '0.6rem' }}
                disabled={loading}
              />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>OR</div>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg" 
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null);
                }}
                disabled={loading || !!imageFile}
              />
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Upload an image from device or paste a URL. Leave blank for default.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? loadingText : 'Save Saree'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSareeModal;
