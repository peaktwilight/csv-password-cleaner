import { useState, useEffect } from 'react';
import type { SecurityAnalysis, PasswordEntry, ReusedPassword } from '@/types/password';
import { getPasswordStrength } from '@/utils/passwordUtils';
import {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface SecurityDashboardProps {
  analysis: SecurityAnalysis;
  onUpdateStatus: (entry: PasswordEntry, status: 'keep' | 'delete' | 'review') => void;
}

interface PasswordRevealState {
  section: 'reused' | 'weak';
  groupIndex?: number;
  entryIndex: number;
}

const SecurityIssueSection = ({ 
  title, 
  icon: Icon, 
  count, 
  totalCount,
  children 
}: { 
  title: string;
  icon: any;
  count: number;
  totalCount: number;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = Math.round((count / totalCount) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-red-50">
            <Icon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              {count} {count === 1 ? 'issue' : 'issues'} found ({percentage}% of total)
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 py-4 border-t border-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordEntry = ({ 
  entry,
  section,
  groupIndex,
  entryIndex,
  revealedPassword,
  onTogglePassword,
  onUpdateStatus
}: { 
  entry: PasswordEntry;
  section: 'reused' | 'weak';
  groupIndex?: number;
  entryIndex: number;
  revealedPassword: PasswordRevealState | null;
  onTogglePassword: (section: 'reused' | 'weak', groupIndex: number | undefined, entryIndex: number) => void;
  onUpdateStatus: (entry: PasswordEntry, status: 'keep' | 'delete' | 'review') => void;
}) => {
  const isRevealed = revealedPassword?.section === section && 
                     revealedPassword?.groupIndex === groupIndex && 
                     revealedPassword?.entryIndex === entryIndex;
  const strength = getPasswordStrength(entry.password);
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900 truncate">{entry.url}</span>
          <span className="text-sm text-gray-500">({entry.username})</span>
        </div>
        <div className="flex items-center mt-1 group/password relative">
          <div className="relative flex-1">
            <input
              type={isRevealed ? 'text' : 'password'}
              value={entry.password}
              readOnly
              className="w-full bg-gray-50 px-3 py-1.5 pr-20 rounded text-sm font-mono border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <button
                onClick={() => onTogglePassword(section, groupIndex, entryIndex)}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                title={isRevealed ? 'Hide password' : 'Show password'}
              >
                {isRevealed ? (
                  <EyeSlashIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(entry.password);
                  // Could add a toast notification here
                }}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                title="Copy password"
              >
                <ClipboardIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        {isRevealed && (
          <div className="mt-1">
            <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center ${strength.color} bg-opacity-10`}>
              <span className={`w-2 h-2 rounded-full ${strength.color} mr-1`} />
              {strength.label}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onUpdateStatus(entry, 'keep')}
          className={`px-3 py-1.5 rounded text-sm ${
            entry.status === 'keep'
              ? 'bg-green-100 text-green-700'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          Keep
        </button>
        <button
          onClick={() => onUpdateStatus(entry, 'delete')}
          className={`px-3 py-1.5 rounded text-sm ${
            entry.status === 'delete'
              ? 'bg-red-100 text-red-700'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          Delete
        </button>
        <button
          onClick={() => onUpdateStatus(entry, 'review')}
          className={`px-3 py-1.5 rounded text-sm ${
            entry.status === 'review' || !entry.status
              ? 'bg-yellow-100 text-yellow-700'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          Review Later
        </button>
      </div>
    </div>
  );
};

const ReusedPasswordGroup = ({ 
  group,
  groupIndex,
  revealedPassword,
  onTogglePassword,
  onUpdateStatus
}: { 
  group: ReusedPassword;
  groupIndex: number;
  revealedPassword: PasswordRevealState | null;
  onTogglePassword: (section: 'reused' | 'weak', groupIndex: number | undefined, entryIndex: number) => void;
  onUpdateStatus: (entry: PasswordEntry, status: 'keep' | 'delete' | 'review') => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const strength = getPasswordStrength(group.password);

  // Count passwords by status
  const stats = {
    keep: group.entries.filter(e => e.status === 'keep').length,
    delete: group.entries.filter(e => e.status === 'delete').length,
    review: group.entries.filter(e => e.status === 'review' || !e.status).length
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                Used in {group.entries.length} accounts
              </h4>
              <div className="flex space-x-2">
                {stats.keep > 0 && (
                  <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded-full flex items-center space-x-1">
                    <CheckIcon className="w-3 h-3" />
                    <span>{stats.keep}</span>
                  </span>
                )}
                {stats.delete > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-xs rounded-full flex items-center space-x-1">
                    <XMarkIcon className="w-3 h-3" />
                    <span>{stats.delete}</span>
                  </span>
                )}
                {stats.review > 0 && (
                  <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full flex items-center space-x-1">
                    <QuestionMarkCircleIcon className="w-3 h-3" />
                    <span>{stats.review}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1">
              <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center ${strength.color} bg-opacity-10`}>
                <span className={`w-2 h-2 rounded-full ${strength.color} mr-1`} />
                {strength.label}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to keep ALL passwords in this group? This will mark them as safe to keep.`)) {
                  group.entries.forEach(entry => onUpdateStatus(entry, 'keep'));
                }
              }}
              className="px-3 py-1.5 text-sm rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              Keep All
            </button>
            <button
              onClick={() => {
                if (confirm(`⚠️ Warning: This will mark ALL passwords in this group for deletion. Are you sure?`)) {
                  group.entries.forEach(entry => onUpdateStatus(entry, 'delete'));
                }
              }}
              className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              Delete All
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
            {group.entries.map((entry, index) => (
              <PasswordEntry
                key={`${entry.url}-${entry.username}-${index}`}
                entry={entry}
                section="reused"
                groupIndex={groupIndex}
                entryIndex={index}
                revealedPassword={revealedPassword}
                onTogglePassword={onTogglePassword}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SecurityDashboard({ analysis, onUpdateStatus }: SecurityDashboardProps) {
  const [revealedPassword, setRevealedPassword] = useState<PasswordRevealState | null>(null);

  // Auto-hide password after 30 seconds
  useEffect(() => {
    if (revealedPassword) {
      const timer = setTimeout(() => {
        setRevealedPassword(null);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [revealedPassword]);

  const handleTogglePassword = (section: 'reused' | 'weak', groupIndex: number | undefined, entryIndex: number) => {
    setRevealedPassword(prev => {
      if (prev?.section === section && 
          prev?.groupIndex === groupIndex && 
          prev?.entryIndex === entryIndex) {
        return null;
      }
      return { section, groupIndex, entryIndex };
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Passwords</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.totalPasswords}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShieldExclamationIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Passwords</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analysis.uniquePasswords}
                <span className="text-sm text-gray-500 font-normal ml-1">
                  ({Math.round((analysis.uniquePasswords / analysis.totalPasswords) * 100)}%)
                </span>
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <ShieldExclamationIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Weak Passwords</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analysis.weakPasswords.length}
                <span className="text-sm text-gray-500 font-normal ml-1">
                  ({Math.round((analysis.weakPasswords.length / analysis.totalPasswords) * 100)}%)
                </span>
              </p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Issues */}
      <div className="space-y-4">
        <SecurityIssueSection
          title="Reused Passwords"
          icon={ShieldExclamationIcon}
          count={analysis.reusedPasswords.length}
          totalCount={analysis.totalPasswords}
        >
          <div className="space-y-4">
            {analysis.reusedPasswords.map((group, index) => (
              <ReusedPasswordGroup
                key={index}
                group={group}
                groupIndex={index}
                revealedPassword={revealedPassword}
                onTogglePassword={handleTogglePassword}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </SecurityIssueSection>

        <SecurityIssueSection
          title="Weak Passwords"
          icon={ExclamationTriangleIcon}
          count={analysis.weakPasswords.length}
          totalCount={analysis.totalPasswords}
        >
          <div className="space-y-2">
            {analysis.weakPasswords.map((entry, index) => (
              <PasswordEntry
                key={`${entry.url}-${entry.username}-${index}`}
                entry={entry}
                section="weak"
                entryIndex={index}
                revealedPassword={revealedPassword}
                onTogglePassword={handleTogglePassword}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </SecurityIssueSection>
      </div>
    </div>
  );
} 