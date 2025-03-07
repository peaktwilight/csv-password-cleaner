import { useState } from 'react';
import { PasswordGroup, PasswordEntry } from '@/types/password';
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon, CheckIcon, XMarkIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface PasswordListProps {
  groups: PasswordGroup[];
  onUpdateStatus: (groupUrl: string, entryIndex: number, status: PasswordEntry['status']) => void;
}

export default function PasswordList({ groups, onUpdateStatus }: PasswordListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (url: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: PasswordEntry['status']) => {
    switch (status) {
      case 'keep':
        return 'bg-green-100 text-green-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'review':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const visitSite = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div 
          key={group.url} 
          className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md"
        >
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => toggleGroup(group.url)}
          >
            <div className="flex items-center space-x-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="truncate">{group.url}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    visitSite(group.url);
                  }}
                  className="ml-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                  title="Visit website"
                >
                  <ExternalLinkIcon className="w-4 h-4 text-blue-600" />
                </button>
              </h3>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {group.entries.length} password{group.entries.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`transform transition-transform duration-200 ${expandedGroups.has(group.url) ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${expandedGroups.has(group.url) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-4 space-y-4">
              {group.entries.map((entry, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4 space-y-2 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{entry.username}</p>
                      <p className="text-sm text-gray-600">{entry.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onUpdateStatus(group.url, index, 'keep')}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          entry.status === 'keep' 
                            ? 'bg-green-100 hover:bg-green-200' 
                            : 'hover:bg-gray-100'
                        }`}
                        title="Keep"
                      >
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(group.url, index, 'delete')}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          entry.status === 'delete' 
                            ? 'bg-red-100 hover:bg-red-200' 
                            : 'hover:bg-gray-100'
                        }`}
                        title="Delete"
                      >
                        <XMarkIcon className="w-5 h-5 text-red-600" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(group.url, index, 'review')}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          entry.status === 'review' 
                            ? 'bg-yellow-100 hover:bg-yellow-200' 
                            : 'hover:bg-gray-100'
                        }`}
                        title="Mark for review"
                      >
                        <QuestionMarkCircleIcon className="w-5 h-5 text-yellow-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${getStatusColor(entry.status)}`}>
                      {entry.status || 'review'}
                    </span>
                    {entry.timeLastUsed && (
                      <span className="text-xs text-gray-500">
                        Last used: {new Date(entry.timeLastUsed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 