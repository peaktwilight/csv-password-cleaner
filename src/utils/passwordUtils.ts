import Papa from 'papaparse';
import { ImportedData, PasswordEntry, PasswordGroup, SecurityAnalysis } from '@/types/password';

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

export const analyzePasswordSecurity = (entries: PasswordEntry[]): SecurityAnalysis => {
  const reusedPasswords = new Map<string, PasswordEntry[]>();
  const weakPasswords: PasswordEntry[] = [];

  entries.forEach(entry => {
    // Check for reused passwords
    const entries = reusedPasswords.get(entry.password) || [];
    entries.push(entry);
    reusedPasswords.set(entry.password, entries);

    // Check for weak passwords
    const strength = getPasswordStrength(entry.password);
    if (strength.score < 3) {
      weakPasswords.push(entry);
    }
  });

  // Filter out passwords that are only used once
  const reusedPasswordsArray = Array.from(reusedPasswords.entries())
    .filter(([_, entries]) => entries.length > 1)
    .map(([password, entries]) => ({
      password,
      entries: entries.sort((a, b) => a.url.localeCompare(b.url))
    }));

  return {
    reusedPasswords: reusedPasswordsArray,
    weakPasswords,
    totalPasswords: entries.length,
    uniquePasswords: new Set(entries.map(e => e.password)).size
  };
};

export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: 'None', color: 'bg-gray-200' };
  
  let score = 0;
  
  // Length checks
  if (password.length >= 16) score += 2;
  else if (password.length >= 12) score += 1.5;
  else if (password.length >= 8) score += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Additional complexity checks
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/.test(password)) score += 1;
  if (!/(.)\1{2,}/.test(password)) score += 0.5; // No character repeated more than twice in a row
  
  // Map score to label and color
  if (score >= 5) return { score, label: 'Very Strong', color: 'bg-emerald-500' };
  if (score >= 4) return { score, label: 'Strong', color: 'bg-green-500' };
  if (score >= 3) return { score, label: 'Good', color: 'bg-blue-500' };
  if (score >= 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
  return { score, label: 'Weak', color: 'bg-red-500' };
}; 