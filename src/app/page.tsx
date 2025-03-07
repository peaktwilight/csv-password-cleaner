'use client';

import { useState } from 'react';
import { PasswordEntry, PasswordGroup } from '@/types/password';
import { parseCSV, groupPasswordsByDomain, exportToCSV } from '@/utils/passwordUtils';
import PasswordList from '@/components/PasswordList';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [passwordGroups, setPasswordGroups] = useState<PasswordGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const data = await parseCSV(file);
      const entries = data.map((item): PasswordEntry => ({
        name: item.name,
        url: item.url,
        username: item.username,
        password: item.password,
        timeCreated: item['date_created'],
        timeLastUsed: item['date_last_used'],
        timePasswordChanged: item['date_password_changed'],
        status: 'review'
      }));
      
      const groups = groupPasswordsByDomain(entries);
      setPasswordGroups(groups);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please make sure it\'s a valid export file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const allEntries = passwordGroups.flatMap(group => group.entries);
    const csv = exportToCSV(allEntries);
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_passwords.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const updatePasswordStatus = (groupUrl: string, entryIndex: number, status: PasswordEntry['status']) => {
    setPasswordGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.url === groupUrl) {
          const newEntries = [...group.entries];
          newEntries[entryIndex] = { ...newEntries[entryIndex], status };
          return { ...group, entries: newEntries };
        }
        return group;
      })
    );
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Password Cleaner</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload your password export file, manage duplicates, and clean up your passwords locally and securely.
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <label className="relative inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
            
            {passwordGroups.length > 0 && (
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export Cleaned CSV
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your passwords...</p>
          </div>
        ) : passwordGroups.length > 0 ? (
          <PasswordList
            groups={passwordGroups}
            onUpdateStatus={updatePasswordStatus}
          />
        ) : (
          <div className="text-center text-gray-500">
            No passwords uploaded yet. Upload a CSV file to get started.
          </div>
        )}
      </div>
    </main>
  );
}
