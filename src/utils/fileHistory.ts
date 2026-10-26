export interface HistoryItem {
  id: string;
  toolId: string;
  toolTitle: string;
  fileName: string;
  outputName: string;
  timestamp: number;
  inputSize: number;
  outputSize: number;
}

const HISTORY_KEY = 'pdfmaster_file_history';

export function getFileHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFileHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
  try {
    const list = getFileHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...list].slice(0, 30); // keep last 30 metadata records
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearFileHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}
