import { SCRIPT_URL } from './config';

export async function fetchSarees() {
  const response = await fetch(SCRIPT_URL);
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error || 'Failed to fetch sarees');
}

export async function addSaree(saree) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'add', saree })
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result;
}

export async function markSareeAsSold(id) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'markSold', id })
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result;
}

export async function deleteSareeFromCloud(id) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', id })
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result;
}
