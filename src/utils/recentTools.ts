const RECENT_KEY = 'pdfmaster_recent_tools';
const FAVORITES_KEY = 'pdfmaster_favorite_tools';

export function getRecentTools(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-jpg'];
  } catch {
    return ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-jpg'];
  }
}

export function addRecentTool(toolId: string) {
  try {
    const current = getRecentTools().filter((id) => id !== toolId);
    current.unshift(toolId);
    localStorage.setItem(RECENT_KEY, JSON.stringify(current.slice(0, 10)));
  } catch {
    // ignore
  }
}

export function getFavoriteTools(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['merge-pdf', 'compress-pdf', 'sign-pdf', 'protect-pdf-with-password'];
  } catch {
    return ['merge-pdf', 'compress-pdf', 'sign-pdf', 'protect-pdf-with-password'];
  }
}

export function toggleFavoriteTool(toolId: string): boolean {
  try {
    const current = getFavoriteTools();
    let updated: string[];
    let isFav = false;
    if (current.includes(toolId)) {
      updated = current.filter((id) => id !== toolId);
    } else {
      updated = [...current, toolId];
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return isFav;
  } catch {
    return false;
  }
}
