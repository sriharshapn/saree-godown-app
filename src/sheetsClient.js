export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypRfc9cta7EqxkV5PyhA5WRbiL1wJZ0Ay-hdnLgcJE7mKfoLDLms66b2riPITV9kzxHQ/exec';

export function getDriveImageUrl(url) {
  if (!url) return '';
  // Check if it's already a direct viewing url or not a drive url
  if (!url.includes('googleusercontent.com/d/') && !url.includes('drive.google.com/file/d/')) {
    return url;
  }
  
  // Extract ID from lh3.googleusercontent.com/d/ID or drive.google.com/file/d/ID
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    // Generate a reliable thumbnail view URL instead of relying on the ephemeral lh3 link
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  
  return url;
}

export async function fetchInventory() {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'GET'
    });
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON from Apps Script:", text);
      return { inventory: [], sales: [] };
    }
    
    if (result.success && result.data) {
      // Map the generic fields back to frontend expected fields if necessary, 
      // but since backend headers are same, we just rename rate->costPrice
      const inventory = (result.data.inventory || []).map(item => ({
        id: item.id,
        modelName: item.modelName,
        costPrice: Number(item.rate),
        sellingPrice: Number(item.sellingPrice),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        imageUrl: item.imageUrl,
        status: item.status,
        dateAdded: item.dateAdded,
        dateSold: item.dateSold,
        soldPrice: Number(item.soldPrice),
        quantity: Number(item.quantity) || 1,
        soldQuantity: Number(item.soldQuantity) || 0,
        category: item.category || 'saree'
      }));

      // Sort by date added (newest first)
      inventory.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

      const sales = result.data.sales || [];
      sales.sort((a, b) => new Date(b.dateSold) - new Date(a.dateSold));

      return { inventory, sales };
    } else {
      console.error("API returned error:", result.error);
      return { inventory: [], sales: [] };
    }
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return { inventory: [], sales: [] };
  }
}

export async function addItem(item) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', item, category: item.category })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('addItem failed:', e);
    return { success: false, error: e.message };
  }
}

export async function markItemAsSold(id, soldPrice, sellQuantity, category) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'markSold', id, soldPrice, sellQuantity, category })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('markSold failed:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteItemFromCloud(id, category) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id, category })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('delete failed:', e);
    return { success: false, error: e.message };
  }
}

export async function undoSale(transactionId, comment, category) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'undoSale', transactionId, comment, category })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('undoSale failed:', e);
    return { success: false, error: e.message };
  }
}

export async function editItem(id, updates, category) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'edit', id, updates, category })
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('editItem failed:', e);
    return { success: false, error: e.message };
  }
}
