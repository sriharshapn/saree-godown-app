export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywQ-9ZlU9G5m2Xn5N_Kq-z7H00n-h9hXv-XgXb7W9M0H-F_K1E_nE2K9s9lZ1v2h8c/exec';

export function getDriveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:image')) return url; // base64 preview

  // Convert unreliable lh3 URLs to highly reliable Drive thumbnail API
  if (url.includes('lh3.googleusercontent.com/d/')) {
    const id = url.split('/d/')[1].split('/')[0].split('?')[0];
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }
  
  // Convert standard Drive web URLs
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1].split('/')[0];
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }

  return url;
}

export async function fetchSarees() {
  try {
    const response = await fetch(SCRIPT_URL);
    const text = await response.text();
    const result = JSON.parse(text);
    if (result.success && result.data) {
      // Normalize data types from Google Sheets
      const sarees = (result.data.sarees || []).map(s => ({
        ...s,
        rate: Number(s.rate) || 0,
        status: String(s.status || 'available'),
        modelName: String(s.modelName || ''),
        costPrice: Number(s.costPrice) || Number(s.rate) || 0,
        sellingPrice: Number(s.sellingPrice) || Number(s.rate) || 0,
        salePrice: s.salePrice ? Number(s.salePrice) : null,
        imageUrl: getDriveImageUrl(String(s.imageUrl || '')),
        dateAdded: String(s.dateAdded || new Date().toISOString()),
        dateSold: s.dateSold ? String(s.dateSold) : '',
        soldPrice: Number(s.soldPrice) || 0,
        quantity: Number(s.quantity) || 1,
        soldQuantity: Number(s.soldQuantity) || 0
      }));
      
      const sales = (result.data.sales || []).map(sale => ({
        ...sale,
        quantitySold: Number(sale.quantitySold) || 0,
        pricePerPiece: Number(sale.pricePerPiece) || 0,
        totalPrice: Number(sale.totalPrice) || 0,
        dateSold: String(sale.dateSold || ''),
        status: String(sale.status || 'completed'),
        comment: String(sale.comment || '')
      }));

      return { sarees, sales };
    }
    console.error('Sheets API error:', result.error);
    return { sarees: [], sales: [] };
  } catch (e) {
    console.error('fetchSarees error:', e);
    return { sarees: [], sales: [] };
  }
}

export async function addSaree(saree) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', saree })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('addSaree failed:', e);
    return { success: false, error: e.message };
  }
}

export async function markSareeAsSold(id, soldPrice, sellQuantity) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'markSold', id, soldPrice, sellQuantity })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('markSold failed:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteSareeFromCloud(id) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('delete failed:', e);
    return { success: false, error: e.message };
  }
}
export async function undoSale(transactionId, comment) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'undoSale', transactionId, comment })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('undoSale failed:', e);
    return { success: false, error: e.message };
  }
}

export async function editSaree(id, updates) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'edit', id, updates })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('editSaree failed:', e);
    return { success: false, error: e.message };
  }
}
