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
        <div key={group.url} className="bg-white rounded-lg shadow p-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleGroup(group.url)}
          >
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">{group.url}</h3>
              <span className="text-sm text-gray-500">
                {group.entries.length} password{group.entries.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                visitSite(group.url);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Visit website"
            >
              <ExternalLinkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {expandedGroups.has(group.url) && (
            <div className="mt-4 space-y-4">
              {group.entries.map((entry, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{entry.username}</p>
                      <p className="text-sm text-gray-500">{entry.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onUpdateStatus(group.url, index, 'keep')}
                        className={`p-2 rounded-full ${entry.status === 'keep' ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                        title="Keep"
                      >
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(group.url, index, 'delete')}
                        className={`p-2 rounded-full ${entry.status === 'delete' ? 'bg-red-100' : 'hover:bg-gray-100'}`}
                        title="Delete"
                      >
                        <XMarkIcon className="w-5 h-5 text-red-600" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(group.url, index, 'review')}
                        className={`p-2 rounded-full ${entry.status === 'review' ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                        title="Mark for review"
                      >
                        <QuestionMarkCircleIcon className="w-5 h-5 text-yellow-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
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
          )}
        </div>
      ))}
    </div>
  );
} 