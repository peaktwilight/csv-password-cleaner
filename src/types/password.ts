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

export interface ReusedPassword {
  password: string;
  entries: PasswordEntry[];
}

export interface SecurityAnalysis {
  reusedPasswords: ReusedPassword[];
  weakPasswords: PasswordEntry[];
  totalPasswords: number;
  uniquePasswords: number;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
} 