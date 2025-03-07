import { useState, useCallback, memo } from 'react';
import { PasswordGroup, PasswordEntry } from '@/types/password';
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon, CheckIcon, XMarkIcon, QuestionMarkCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordListProps {
  groups: PasswordGroup[];
  onUpdateStatus: (groupUrl: string, entryIndex: number, status: PasswordEntry['status']) => void;
}

interface PasswordRevealState {
  groupUrl: string;
  index: number;
}

// Memoize individual password entry to prevent unnecessary re-renders
const PasswordEntryItem = memo(({ 
  entry, 
  index, 
  groupUrl, 
  onUpdateStatus, 
  revealedPassword,
  togglePasswordVisibility,
  visitSite
}: {
  entry: PasswordEntry;
  index: number;
  groupUrl: string;
  onUpdateStatus: (groupUrl: string, entryIndex: number, status: PasswordEntry['status']) => void;
  revealedPassword: PasswordRevealState | null;
  togglePasswordVisibility: (groupUrl: string, index: number) => void;
  visitSite: (url: string) => void;
}) => {
  const getStatusColor = (status: PasswordEntry['status']) => {
    switch (status) {
      case 'keep': return 'bg-green-100 text-green-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'review':
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-2 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="font-medium text-gray-900">{entry.username}</p>
          <p className="text-sm text-gray-600">{entry.name}</p>
          <div className="flex items-center mt-2 group/password relative">
            <div className="relative flex items-center">
              <input
                type={revealedPassword?.groupUrl === groupUrl && revealedPassword?.index === index ? 'text' : 'password'}
                value={entry.password}
                readOnly
                className="bg-gray-50 px-3 py-1.5 pr-10 rounded-lg text-sm font-mono border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <button
                onClick={() => togglePasswordVisibility(groupUrl, index)}
                className="absolute right-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                title={revealedPassword?.groupUrl === groupUrl && revealedPassword?.index === index ? 'Hide password' : 'Show password'}
              >
                {revealedPassword?.groupUrl === groupUrl && revealedPassword?.index === index ? (
                  <EyeSlashIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <button
              onClick={(e) => visitSite(groupUrl)}
              className="ml-2 p-1.5 rounded-full opacity-0 group-hover/password:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
              title="Visit website to test password"
            >
              <ExternalLinkIcon className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdateStatus(groupUrl, index, 'keep')}
            className={`p-2 rounded-full transition-all duration-200 ${
              entry.status === 'keep' ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-gray-100'
            }`}
            title="Keep"
          >
            <CheckIcon className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={() => onUpdateStatus(groupUrl, index, 'delete')}
            className={`p-2 rounded-full transition-all duration-200 ${
              entry.status === 'delete' ? 'bg-red-100 hover:bg-red-200' : 'hover:bg-gray-100'
            }`}
            title="Delete"
          >
            <XMarkIcon className="w-5 h-5 text-red-600" />
          </button>
          <button
            onClick={() => onUpdateStatus(groupUrl, index, 'review')}
            className={`p-2 rounded-full transition-all duration-200 ${
              entry.status === 'review' ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-100'
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
  );
});

PasswordEntryItem.displayName = 'PasswordEntryItem';

export default function PasswordList({ groups, onUpdateStatus }: PasswordListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [revealedPassword, setRevealedPassword] = useState<PasswordRevealState | null>(null);

  const toggleGroup = useCallback((url: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  }, []);

  const visitSite = useCallback((url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  }, []);

  const togglePasswordVisibility = useCallback((groupUrl: string, index: number) => {
    setRevealedPassword(prev => {
      if (prev?.groupUrl === groupUrl && prev?.index === index) {
        return null;
      }
      return { groupUrl, index };
    });
  }, []);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div 
          key={group.url} 
          className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md"
        >
          <div 
            className="w-full flex items-center justify-between cursor-pointer group focus:outline-none"
            onClick={() => toggleGroup(group.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleGroup(group.url);
              }
            }}
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
            <div className={`transform transition-transform duration-150 ${expandedGroups.has(group.url) ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div 
            className={`grid transition-all duration-150 ease-in-out ${
              expandedGroups.has(group.url) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-4 space-y-4">
                {group.entries.map((entry, index) => (
                  <PasswordEntryItem
                    key={index}
                    entry={entry}
                    index={index}
                    groupUrl={group.url}
                    onUpdateStatus={onUpdateStatus}
                    revealedPassword={revealedPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    visitSite={visitSite}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 