'use client';

import { useState } from 'react';
import { PasswordEntry, PasswordGroup } from '@/types/password';
import { parseCSV, groupPasswordsByDomain, exportToCSV } from '@/utils/passwordUtils';
import PasswordList from '@/components/PasswordList';
import ExportInstructions from '@/components/ExportInstructions';
import { 
  ArrowUpTrayIcon, 
  ArrowDownTrayIcon, 
  ShieldCheckIcon, 
  BeakerIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
  SparklesIcon,
  UserIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [passwordGroups, setPasswordGroups] = useState<PasswordGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer?.files[0];
    if (!file || !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }
    await processFile(file);
  };

  const processFile = async (file: File) => {
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

  const handleBulkUpdateStatus = (groupUrl: string, status: PasswordEntry['status']) => {
    setPasswordGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.url === groupUrl) {
          const newEntries = group.entries.map(entry => ({ ...entry, status }));
          return { ...group, entries: newEntries };
        }
        return group;
      })
    );
  };

  return (
    <main className="min-h-screen">
      <div className="relative bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Hero content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="flex justify-center">
                <a
                  href="https://github.com/peaktwilight/chrome-csv-password-cleaner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full mb-8 hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  <CodeBracketIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">View Source on GitHub</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                </a>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Password Cleaner
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                A secure, client-side tool for organizing and cleaning up your password exports from Chrome, Brave, Edge, and other Chromium-based browsers.
                Your data never leaves your device.
              </p>
              
              <div className="mt-12 flex flex-col items-center gap-6">
                <button
                  onClick={() => setShowInstructions(true)}
                  className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                >
                  How to export your passwords?
                </button>
                
                <div 
                  className={`w-full max-w-lg p-8 rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm
                    ${dragActive 
                      ? 'border-white/60 bg-white/20 scale-102' 
                      : 'border-white/30 bg-white/10 hover:bg-white/15'
                    }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <label className="flex flex-col items-center justify-center cursor-pointer gap-4">
                    <div className="p-4 bg-white/20 rounded-xl">
                      <ArrowUpTrayIcon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-medium block">
                        {dragActive ? 'Drop your CSV file here' : 'Drag & drop your password CSV'}
                      </span>
                      <span className="text-sm text-blue-100">or click to browse files</span>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">How to Export Your Passwords</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ExportInstructions />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!passwordGroups.length && !isLoading && (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-8">
              {[
                {
                  icon: ShieldCheckIcon,
                  title: 'Client-Side Security',
                  description: 'All processing happens locally in your browser. Your passwords never leave your device - guaranteed.',
                  color: 'bg-emerald-500'
                },
                {
                  icon: SparklesIcon,
                  title: 'Smart Organization',
                  description: 'Automatically groups passwords by domain and helps identify duplicates for easy cleanup.',
                  color: 'bg-blue-500'
                },
                {
                  icon: BeakerIcon,
                  title: 'Built for Privacy',
                  description: 'Zero analytics, no tracking, no data collection. Just a simple tool that respects your privacy.',
                  color: 'bg-purple-500'
                }
              ].map((feature, index) => (
                <div key={index} className="relative bg-white rounded-2xl shadow-lg p-8 transition-transform duration-200 hover:-translate-y-1">
                  <div className={`absolute top-0 -translate-y-1/2 ${feature.color} rounded-xl p-3 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 space-y-24">
              {/* About Section */}
              <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-8 py-12 sm:px-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">About the Developer</h2>
                        <p className="text-gray-600 mt-1">Built by Doruk Tan Ozturk</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="https://github.com/peaktwilight"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
                      >
                        <StarIcon className="w-5 h-5 mr-2" />
                        GitHub Profile
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 prose prose-blue max-w-none">
                    <p>
                      Password Cleaner is a personal project born from the need to efficiently manage and organize browser password exports. 
                      As someone who values both security and user privacy, I built this tool to run entirely in your browser, ensuring your sensitive data stays on your device.
                    </p>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-8 py-12 sm:px-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                      <CommandLineIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Domain Grouping',
                        description: 'Automatically organizes passwords by website domain for better overview.'
                      },
                      {
                        title: 'Duplicate Detection',
                        description: 'Identifies duplicate entries to help you maintain a clean password list.'
                      },
                      {
                        title: 'Local Processing',
                        description: 'All data processing happens in your browser - no server involvement.'
                      },
                      {
                        title: 'Browser Support',
                        description: 'Works with exports from Chrome, Brave, Edge, and other Chromium browsers.'
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Open Source Section */}
              <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-8 py-12 sm:px-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                        <CodeBracketIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Open Source</h2>
                        <p className="text-gray-600 mt-1">Transparent and free to use</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="https://github.com/peaktwilight/chrome-csv-password-cleaner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                        View Source
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'MIT License',
                        description: 'Free to use, modify, and distribute. No strings attached.'
                      },
                      {
                        title: 'Fully Auditable',
                        description: 'Every line of code is open for review and verification.'
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {isLoading ? (
          <div className="text-center py-24">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 text-lg">Processing your passwords...</p>
          </div>
        ) : passwordGroups.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Password Groups ({passwordGroups.length})
              </h2>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow font-medium"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export Cleaned CSV
              </button>
            </div>
            <PasswordList
              groups={passwordGroups}
              onUpdateStatus={updatePasswordStatus}
              onBulkUpdateStatus={handleBulkUpdateStatus}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
