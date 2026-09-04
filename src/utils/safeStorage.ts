function pruneItem(item: any): any {
  if (!item || typeof item !== 'object') return item;
  const copy: any = {
    id: item.id,
    title: item.title,
    category: item.category,
    state: item.state,
    date: item.date,
    lastDate: item.lastDate,
    shortInfo: item.shortInfo || item.summary,
    image: item.image || item.heroImage || item.thumbnail,
    slug: item.slug,
    department: item.department,
    vacancies: item.vacancies,
    isImportant: item.isImportant,
    importantLinks: item.importantLinks
  };

  if (typeof item.fullDescription === 'string') {
    copy.fullDescription = item.fullDescription.length > 250
      ? item.fullDescription.slice(0, 250) + '...'
      : item.fullDescription;
  }
  if (typeof item.content === 'string') {
    copy.content = item.content.length > 250
      ? item.content.slice(0, 250) + '...'
      : item.content;
  }

  return copy;
}

export function safeSetLocalStorage(key: string, data: any): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  // If array, proactively create a lightweight version to fit within ~50KB instead of 5MB
  let payloadToSave = data;
  if (Array.isArray(data)) {
    payloadToSave = data.slice(0, 35).map(pruneItem);
  }

  try {
    const serialized = JSON.stringify(payloadToSave);
    localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    // If quota exceeded, try even more aggressive pruning
    if (Array.isArray(data)) {
      try {
        const minimal = data.slice(0, 15).map(pruneItem);
        localStorage.setItem(key, JSON.stringify(minimal));
        return true;
      } catch (e2) {
        try {
          // Clear current key to free space
          localStorage.removeItem(key);
        } catch (_) {}
        return false;
      }
    } else {
      try {
        localStorage.removeItem(key);
      } catch (_) {}
      return false;
    }
  }
}

export function safeGetLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

