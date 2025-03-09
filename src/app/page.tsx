'use client';

import { useState } from 'react';
import type { PasswordEntry, PasswordGroup } from '@/types/password';
import { parseCSV, groupPasswordsByDomain, exportToCSV, analyzePasswordSecurity, normalizeUrl } from '@/utils/passwordUtils';
import PasswordList from '@/components/PasswordList';
import SecurityDashboard from '@/components/SecurityDashboard';
import ExportInstructions from '@/components/ExportInstructions';
import RandomPasswordGenerator from '@/components/RandomPasswordGenerator';
import { 
  ArrowUpTrayIcon, 
  ArrowDownTrayIcon, 
  ShieldCheckIcon, 
  BeakerIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  UserGroupIcon,
  ArrowsUpDownIcon,
  TrashIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [passwordGroups, setPasswordGroups] = useState<PasswordGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);

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

      // Scroll to password groups section after a short delay to ensure rendering is complete
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight*2/3,
          behavior: 'smooth'
        });
      }, 100);
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
          return {
            ...group,
            entries: group.entries.map(entry => ({ ...entry, status }))
          };
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
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  CSV Password Cleaner
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  An open-source tool for organizing and cleaning up your browser passwords. Import your Chrome, Brave, or Edge password exports, 
                  review them efficiently, and export a clean, organized password list.
                </p>
                
                <div className="mt-12 flex flex-col items-center gap-6">
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-medium">How to export your passwords</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </button>
                  
                  <div 
                    className={`w-full max-w-lg p-8 rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm
                      ${dragActive 
                        ? 'border-white/60 bg-white/20 scale-105 shadow-2xl shadow-blue-500/20' 
                        : 'border-white/30 bg-white/10 hover:bg-white/15 hover:scale-102 hover:shadow-xl hover:shadow-blue-500/10'
                      }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                  >
                    <label className="flex flex-col items-center justify-center cursor-pointer gap-6">
                      {/* Key turning animation with glow effect */}
                      <div className={`w-32 h-32 p-4 bg-white/10 rounded-2xl backdrop-blur-sm transition-all duration-300
                        ${dragActive ? 'scale-110 shadow-2xl shadow-blue-500/30' : 'hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20'}`}>
                        <img 
                          src="/key-turning.gif" 
                          alt="Key turning animation" 
                          className="w-full h-full"
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <span className="text-xl font-medium block">
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

                  <a
                    href="https://github.com/peaktwilight/chrome-csv-password-cleaner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <CodeBracketIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">View Source on GitHub</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">How to Export Your Passwords</h3>
                <p className="mt-1 text-sm text-gray-500">Follow these steps for your browser</p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <ExportInstructions />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!passwordGroups.length && !isLoading && (
          <>
            {/* Core Features */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-8">
              {[
                {
                  icon: ShieldCheckIcon,
                  title: 'Client-Side Security',
                  description: 'Process your passwords locally in your browser. No servers, no data collection, complete privacy.',
                  color: 'bg-emerald-500'
                },
                {
                  icon: AdjustmentsHorizontalIcon,
                  title: 'Batch Actions',
                  description: 'Efficiently manage passwords with bulk actions. Keep or delete entire domain groups with one click.',
                  color: 'bg-blue-500'
                },
                {
                  icon: MagnifyingGlassIcon,
                  title: 'Smart Search',
                  description: 'Quickly find passwords by domain name. Sort and filter to focus on what matters.',
                  color: 'bg-purple-500'
                }
              ].map((feature, index) => (
                <div key={index} className="relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className={`absolute top-0 -translate-y-1/2 ${feature.color} rounded-xl p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-6 h-6 text-white transition-transform duration-300 hover:rotate-12" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Password Generator Section */}
            <section className="mt-24 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <div className="px-8 py-12 sm:px-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Password Generator</h2>
                    <p className="text-gray-600 mt-1">Create strong, secure passwords instantly</p>
                  </div>
                </div>
                <RandomPasswordGenerator />
              </div>
            </section>

            <div className="mt-24 space-y-24">
              {/* Password Management Features */}
              <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-8 py-12 sm:px-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                      <UserGroupIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Password Management</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Domain Grouping',
                        description: 'Automatically organizes passwords by website domain. See how many passwords you have per domain.',
                        icon: DocumentDuplicateIcon
                      },
                      {
                        title: 'Progress Tracking',
                        description: 'Monitor your review progress with a clear percentage indicator. Know exactly how many passwords you\'ve processed.',
                        icon: CheckCircleIcon
                      },
                      {
                        title: 'Bulk Actions',
                        description: 'Keep or delete all passwords for a domain at once. Perfect for cleaning up old or unused accounts.',
                        icon: TrashIcon
                      },
                      {
                        title: 'Smart Sorting',
                        description: 'Sort domains by name or review progress. Find and organize passwords efficiently.',
                        icon: ArrowsUpDownIcon
                      },
                      {
                        title: 'Review States',
                        description: 'Mark passwords for review later. Three states: Keep, Delete, or Review Later.',
                        icon: AdjustmentsHorizontalIcon
                      },
                      {
                        title: 'Search Functionality',
                        description: 'Quickly find specific domains or accounts with the built-in search feature.',
                        icon: MagnifyingGlassIcon
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1">
                        <feature.icon className="w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                          <p className="mt-2 text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-8 py-12 sm:px-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                        <BeakerIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
                        <p className="text-gray-600 mt-1">Simple, secure, and efficient</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-6">
                    <div className="prose prose-blue max-w-none">
                      <ol className="space-y-4">
                        <li className="flex items-center gap-4">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">1</span>
                          <span>Export your passwords from Chrome, Brave, or Edge as a CSV file</span>
                        </li>
                        <li className="flex items-center gap-4">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">2</span>
                          <span>Upload the CSV file - all processing happens in your browser</span>
                        </li>
                        <li className="flex items-center gap-4">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">3</span>
                          <span>Review passwords grouped by domain, with options to keep, delete, or review later</span>
                        </li>
                        <li className="flex items-center gap-4">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">4</span>
                          <span>Export your cleaned password list, ready to import back into your browser</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </section>

              {/* Developer Section */}
              <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="px-8 py-12 sm:px-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                        <CodeBracketIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Open Source Project</h2>
                        <p className="text-gray-600 mt-1">Built by Doruk Tan Ozturk</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="https://github.com/peaktwilight/chrome-csv-password-cleaner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 font-medium"
                      >
                        <StarIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                        View Source
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 prose prose-blue max-w-none">
                    <p>
                      Password Cleaner is a personal project born from the need to efficiently manage browser password exports. 
                      Built with modern web technologies and a focus on user privacy, it runs entirely in your browser to ensure 
                      your sensitive data never leaves your device.
                    </p>
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPasswordGenerator(true)}
                  className="inline-flex items-center px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 font-medium"
                >
                  <SparklesIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Generate Password
                </button>
                <button
                  onClick={() => setShowSecurityDashboard(!showSecurityDashboard)}
                  className={`inline-flex items-center px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg font-medium ${
                    showSecurityDashboard
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-gray-500/10'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-blue-500/10'
                  }`}
                >
                  <ShieldCheckIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  {showSecurityDashboard ? 'View Passwords' : 'Security Analysis'}
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 font-medium"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Export Cleaned CSV
                </button>
              </div>
            </div>

            {showSecurityDashboard ? (
              <SecurityDashboard
                analysis={analyzePasswordSecurity(passwordGroups.flatMap(g => g.entries))}
                onUpdateStatus={(entry, status) => {
                  const group = passwordGroups.find(g => g.url === normalizeUrl(entry.url));
                  if (group) {
                    const entryIndex = group.entries.findIndex(
                      e => e.username === entry.username && e.password === entry.password
                    );
                    if (entryIndex !== -1) {
                      updatePasswordStatus(group.url, entryIndex, status);
                    }
                  }
                }}
              />
            ) : (
              <PasswordList
                groups={passwordGroups}
                onUpdateStatus={updatePasswordStatus}
                onBulkUpdateStatus={handleBulkUpdateStatus}
              />
            )}
          </div>
        ) : null}
      </div>

      {/* Password Generator Modal */}
      {showPasswordGenerator && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full">
            <div className="flex justify-between items-start p-6 pb-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Password Generator</h3>
                <p className="mt-1 text-sm text-gray-500">Create strong, secure passwords instantly</p>
              </div>
              <button
                onClick={() => setShowPasswordGenerator(false)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <RandomPasswordGenerator />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
