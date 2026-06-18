const HISTORY_KEY = 'pj_token_history';
const MAX_ITEMS = 12;

export function loadTokenHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map(sanitizeHistoryItem);
  } catch {
    return [];
  }
}

function sanitizeHistoryItem(item) {
  if (!item || typeof item !== 'object') return item;
  const { token: _token, publicKeyB64: _pub, ...safe } = item;
  return safe;
}

export function pushTokenHistory(entry) {
  const list = loadTokenHistory();
  const item = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    shopName: entry.shopName,
    planType: entry.planType,
    stationLimit: entry.stationLimit,
    expiresAtUtc: entry.expiresAtUtc,
    tokenPreview: entry.token?.slice(0, 48) + '…',
  };
  const next = [item, ...list.filter((x) => x.id !== item.id)].slice(0, MAX_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearTokenHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
