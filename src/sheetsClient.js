import { SCRIPT_URL } from './config';

export async function fetchSarees() {
  try {
    const response = await fetch(SCRIPT_URL);
    const text = await response.text();
    const result = JSON.parse(text);
    if (result.success) {
      // Normalize data types from Google Sheets
      return result.data.map(s => ({
        ...s,
        rate: Number(s.rate) || 0,
        status: String(s.status || 'available'),
        modelName: String(s.modelName || ''),
        imageUrl: String(s.imageUrl || ''),
        dateAdded: String(s.dateAdded || new Date().toISOString()),
        dateSold: s.dateSold ? String(s.dateSold) : ''
      }));
    }
    console.error('Sheets API error:', result.error);
    return [];
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

export async function markSareeAsSold(id, soldPrice) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'markSold', id, soldPrice })
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
