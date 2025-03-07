import Papa from 'papaparse';
import { ImportedData, PasswordEntry, PasswordGroup } from '@/types/password';

export const parseCSV = (file: File): Promise<ImportedData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter out entries with missing required fields
        const validData = (results.data as ImportedData[]).filter(item => 
          item && 
          typeof item === 'object' &&
          'url' in item &&
          'username' in item &&
          'password' in item
        );
        resolve(validData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const normalizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return 'unknown';
  }

  try {
    // Remove protocol and www
    let normalized = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    // Remove paths and query parameters
    normalized = normalized.split('/')[0];
    // Remove any trailing dots or spaces
    normalized = normalized.trim().replace(/\.+$/, '');
    return normalized.toLowerCase() || 'unknown';
  } catch (e) {
    console.warn('Error normalizing URL:', url, e);
    return 'unknown';
  }
};

export const groupPasswordsByDomain = (entries: PasswordEntry[]): PasswordGroup[] => {
  const groups: { [key: string]: PasswordEntry[] } = {};
  
  entries.forEach((entry) => {
    if (!entry) return;
    
    const normalizedUrl = normalizeUrl(entry.url);
    if (!groups[normalizedUrl]) {
      groups[normalizedUrl] = [];
    }
    groups[normalizedUrl].push(entry);
  });

  return Object.entries(groups)
    .filter(([url]) => url !== 'unknown') // Optional: filter out entries with unknown URLs
    .map(([url, entries]) => ({
      url,
      entries: entries.sort((a, b) => {
        // Sort by last used date if available
        if (a.timeLastUsed && b.timeLastUsed) {
          return new Date(b.timeLastUsed).getTime() - new Date(a.timeLastUsed).getTime();
        }
        return 0;
      }),
    }));
};

export const exportToCSV = (entries: PasswordEntry[]): string => {
  const filteredEntries = entries.filter(entry => entry.status !== 'delete');
  return Papa.unparse(filteredEntries);
}; 