import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Share2, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDriveImageUrl } from '../sheetsClient';
import { fetchImageAsFile, shareFiles, downloadImage, canShareFiles, toFilename } from '../utils/imageShare';

function ShareImagesModal({ items, onClose }) {
  const [message, setMessage] = useState('');
  const [fetchStatus, setFetchStatus] = useState({}); // { [id]: 'idle'|'loading'|'done'|'error' }
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const supportsShare = canShareFiles();

  // Pre-fill message with product names & prices
  useEffect(() => {
    const lines = items.map(item => {
      const price = item.salePrice
        ? `₹${Number(item.salePrice).toLocaleString('en-IN')} (Sale!)`
        : `₹${Number(item.sellingPrice || item.costPrice || 0).toLocaleString('en-IN')}`;
      return `• ${item.modelName} — ${price}`;
    });
    setMessage(`Hi! Here are some products from our collection:\n\n${lines.join('\n')}\n\nInterested? Let us know! 😊`);
  }, [items]);

  const getImageUrls = () =>
    items.map(item => ({
      ...item,
      resolvedUrl: getDriveImageUrl(item.imageUrl ? item.imageUrl.split(',')[0] : ''),
    }));

  const handleShare = async () => {
    setGlobalError('');
    setSuccessMsg('');
    setIsSharing(true);
    const resolved = getImageUrls();

    // Mark all as loading
    const loadingStatus = {};
    resolved.forEach(item => { loadingStatus[item.id] = 'loading'; });
    setFetchStatus(loadingStatus);

    const files = [];
    const nextStatus = { ...loadingStatus };

    for (const item of resolved) {
      if (!item.resolvedUrl) {
        nextStatus[item.id] = 'error';
        continue;
      }
      try {
        const file = await fetchImageAsFile(item.resolvedUrl, toFilename(item.modelName));
        files.push(file);
        nextStatus[item.id] = 'done';
      } catch (e) {
        console.error('Failed to fetch image for', item.modelName, e);
        nextStatus[item.id] = 'error';
      }
      setFetchStatus({ ...nextStatus });
    }

    if (files.length === 0) {
      setGlobalError('Could not load any images. Please check your internet connection.');
      setIsSharing(false);
      return;
    }

    try {
      await shareFiles(files, message);
      setSuccessMsg('Shared successfully!');
    } catch (e) {
      if (e.name !== 'AbortError') {
        setGlobalError('Share was cancelled or failed. You can use "Download All" instead.');
      }
    }
    setIsSharing(false);
  };

  const handleDownloadAll = async () => {
    setGlobalError('');
    setSuccessMsg('');
    setIsDownloading(true);
    const resolved = getImageUrls();

    const loadingStatus = {};
    resolved.forEach(item => { loadingStatus[item.id] = 'loading'; });
    setFetchStatus(loadingStatus);

    const nextStatus = { ...loadingStatus };
    for (const item of resolved) {
      if (!item.resolvedUrl) {
        nextStatus[item.id] = 'error';
        setFetchStatus({ ...nextStatus });
        continue;
      }
      try {
        await downloadImage(item.resolvedUrl, toFilename(item.modelName));
        nextStatus[item.id] = 'done';
      } catch (e) {
        console.error('Download failed for', item.modelName, e);
        nextStatus[item.id] = 'error';
      }
      setFetchStatus({ ...nextStatus });
      // Small delay between downloads to avoid browser blocking
      await new Promise(r => setTimeout(r, 300));
    }

    setSuccessMsg(`Downloaded ${Object.values(nextStatus).filter(s => s === 'done').length} image(s)!`);
    setIsDownloading(false);
  };

  const resolved = getImageUrls();
  const busy = isSharing || isDownloading;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={!busy ? onClose : undefined}>
      <div
        className="modal-content"
        style={{ maxWidth: '560px', width: '95%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-between keep-row" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Share2 size={20} style={{ color: 'var(--primary-gold)' }} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Share Product Images</h2>
          </div>
          {!busy && (
            <button className="btn-secondary" onClick={onClose}
              style={{ padding: '0.3rem 0.5rem', lineHeight: 1 }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Image previews */}
        <div className="image-preview-grid" style={{ marginBottom: '1.5rem' }}>
          {resolved.map(item => {
            const status = fetchStatus[item.id];
            return (
              <div key={item.id} className="image-preview-item">
                {item.resolvedUrl ? (
                  <img
                    src={item.resolvedUrl}
                    alt={item.modelName}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610189013233-3ba6804576d3?q=80&w=300'; }}
                  />
                ) : (
                  <div className="image-preview-placeholder">No Image</div>
                )}
                {/* Status overlay */}
                {status === 'loading' && (
                  <div className="image-preview-overlay">
                    <Loader2 size={20} className="animate-spin" style={{ color: '#fff' }} />
                  </div>
                )}
                {status === 'done' && (
                  <div className="image-preview-overlay" style={{ background: 'rgba(46,139,87,0.7)' }}>
                    <CheckCircle2 size={20} style={{ color: '#fff' }} />
                  </div>
                )}
                {status === 'error' && (
                  <div className="image-preview-overlay" style={{ background: 'rgba(139,28,49,0.7)' }}>
                    <AlertCircle size={20} style={{ color: '#fff' }} />
                  </div>
                )}
                <p className="image-preview-label">{item.modelName}</p>
              </div>
            );
          })}
        </div>

        {/* Message textarea */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label>Message (optional)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            disabled={busy}
            style={{ resize: 'vertical', fontSize: '0.9rem' }}
          />
        </div>

        {/* Errors / success */}
        {globalError && (
          <p style={{ color: '#FF6B6B', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} /> {globalError}
          </p>
        )}
        {successMsg && (
          <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </p>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {supportsShare && (
            <button
              className="btn-share"
              onClick={handleShare}
              disabled={busy}
              style={{ flex: 1, minWidth: '160px' }}
            >
              {isSharing
                ? <><Loader2 size={16} className="animate-spin" /> Preparing…</>
                : <><Share2 size={16} /> Share as JPG</>
              }
            </button>
          )}
          <button
            className="btn-download"
            onClick={handleDownloadAll}
            disabled={busy}
            style={{ flex: 1, minWidth: '160px' }}
          >
            {isDownloading
              ? <><Loader2 size={16} className="animate-spin" /> Downloading…</>
              : <><Download size={16} /> Download All</>
            }
          </button>
          {!supportsShare && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '100%' }}>
              💡 Tip: Open on your phone to share directly to WhatsApp, Instagram, and more.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ShareImagesModal;
