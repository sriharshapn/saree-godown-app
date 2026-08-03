import { SCRIPT_URL } from './config';

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
        imageUrl: String(s.imageUrl || ''),
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
    return [];
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
    // POST may have succeeded even if response reading failed (CORS redirect)
    console.warn('addSaree response parse failed, but POST may have succeeded:', e);
    return { success: true };
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
    console.warn('markSold response parse failed:', e);
    return { success: true };
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
    console.warn('delete response parse failed:', e);
    return { success: true };
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
    console.warn('undoSale response parse failed:', e);
    return { success: true };
  }
}
