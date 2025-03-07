export interface PasswordEntry {
  name: string;
  url: string;
  username: string;
  password: string;
  timeCreated?: string;
  timeLastUsed?: string;
  timePasswordChanged?: string;
  status?: 'keep' | 'delete' | 'review';
  notes?: string;
}

export interface PasswordGroup {
  url: string;
  entries: PasswordEntry[];
}

export interface ImportedData {
  name: string;
  url: string;
  username: string;
  password: string;
  [key: string]: string;
} 