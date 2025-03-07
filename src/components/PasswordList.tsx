import { useState, useCallback, memo, useEffect, useRef } from 'react';
import { PasswordGroup, PasswordEntry } from '@/types/password';
import { 
  ArrowTopRightOnSquareIcon as ExternalLinkIcon, 
  CheckIcon, 
  XMarkIcon, 
  QuestionMarkCircleIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowDownIcon,
  ShieldCheckIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface PasswordListProps {
  groups: PasswordGroup[];
  onUpdateStatus: (groupUrl: string, entryIndex: number, status: PasswordEntry['status']) => void;
}

interface PasswordRevealState {
  groupUrl: string;
  index: number;
}

// Password strength indicator
const PasswordStrength = ({ password }: { password: string }) => {
  // Simple password strength calculation
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-gray-200' };
    
    const length = pwd.length;
    let score = 0;
    
    // Length check
    if (length > 12) score += 2;
    else if (length > 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    // Map score to label and color
    if (score >= 5) return { score, label: 'Strong', color: 'bg-green-500' };
    if (score >= 3) return { score, label: 'Good', color: 'bg-blue-500' };
    if (score >= 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
    return { score, label: 'Weak', color: 'bg-red-500' };
  };
  
  const strength = getStrength(password);
  
  return (
    <div className="mt-1">
      <div className="flex justify-between items-center mb-1">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                i < strength.score ? strength.color : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-2">{strength.label}</span>
      </div>
    </div>
  );
};

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
  const isRevealed = revealedPassword?.groupUrl === groupUrl && revealedPassword?.index === index;
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const getStatusColor = (status: PasswordEntry['status']) => {
    switch (status) {
      case 'keep': return 'bg-green-100 text-green-800 border-green-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      case 'review':
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  
  const getStatusIcon = (status: PasswordEntry['status']) => {
    switch (status) {
      case 'keep': return <CheckIcon className="w-3 h-3" />;
      case 'delete': return <XMarkIcon className="w-3 h-3" />;
      case 'review':
      default: return <QuestionMarkCircleIcon className="w-3 h-3" />;
    }
  };

  const copyPassword = () => {
    if (passwordRef.current) {
      navigator.clipboard.writeText(entry.password);
      
      // Show visual feedback (could be enhanced with a toast notification)
      const originalValue = passwordRef.current.value;
      passwordRef.current.value = "Copied!";
      setTimeout(() => {
        if (passwordRef.current) passwordRef.current.value = originalValue;
      }, 1000);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 space-y-3 transition-all duration-200 hover:border-blue-200 hover:shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <div className="flex items-center">
            <p className="font-medium text-gray-900">{entry.username}</p>
            {entry.name && entry.name !== entry.username && (
              <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                {entry.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center mt-2 group/password relative">
            <div className="relative flex-1">
              <input
                ref={passwordRef}
                type={isRevealed ? 'text' : 'password'}
                value={entry.password}
                readOnly
                className="w-full bg-gray-50 px-3 py-2 pr-20 rounded-lg text-sm font-mono border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <button
                  onClick={() => togglePasswordVisibility(groupUrl, index)}
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
                  onClick={copyPassword}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  title="Copy password"
                >
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <button
              onClick={(e) => visitSite(groupUrl)}
              className="ml-2 p-2 rounded-lg opacity-0 group-hover/password:opacity-100 transition-opacity duration-200 hover:bg-blue-100 text-blue-700"
              title="Visit website to test password"
            >
              <ExternalLinkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {isRevealed && <PasswordStrength password={entry.password} />}
        </div>
        
        <div className="flex space-x-1 ml-4">
          <button
            onClick={() => onUpdateStatus(groupUrl, index, 'keep')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              entry.status === 'keep' 
                ? 'bg-green-100 text-green-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Keep"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onUpdateStatus(groupUrl, index, 'delete')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              entry.status === 'delete' 
                ? 'bg-red-100 text-red-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Delete"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onUpdateStatus(groupUrl, index, 'review')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              entry.status === 'review' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Mark for review"
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200 flex items-center space-x-1 ${getStatusColor(entry.status)}`}>
            {getStatusIcon(entry.status)}
            <span>{entry.status || 'review'}</span>
          </span>
          {entry.timeLastUsed && (
            <span className="text-xs text-gray-500">
              Last used: {new Date(entry.timeLastUsed).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

PasswordEntryItem.displayName = 'PasswordEntryItem';

// Domain icon/favicon component
const DomainIcon = ({ domain }: { domain: string }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-500 uppercase font-bold">
          {domain.charAt(0)}
        </span>
      </div>
    );
  }
  
  return (
    <img 
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={`${domain} icon`}
      className="w-6 h-6 rounded-full"
      onError={() => setError(true)}
    />
  );
};

// Group header with stats, sorting and filtering options
const GroupHeader = memo(({ 
  group, 
  isExpanded, 
  onToggle,
  onVisitSite
}: {
  group: PasswordGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onVisitSite: (url: string) => void;
}) => {
  // Count passwords by status
  const stats = {
    keep: group.entries.filter(e => e.status === 'keep').length,
    delete: group.entries.filter(e => e.status === 'delete').length,
    review: group.entries.filter(e => e.status === 'review' || !e.status).length
  };

  return (
    <div 
      className="w-full flex items-center space-x-3 cursor-pointer group p-4 focus:outline-none"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <DomainIcon domain={group.url} />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center truncate">
          {group.url}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisitSite(group.url);
            }}
            className="ml-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
            title="Visit website"
          >
            <ExternalLinkIcon className="w-4 h-4 text-blue-600" />
          </button>
        </h3>
        
        <div className="flex items-center mt-1 text-sm text-gray-500 space-x-3">
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>{group.entries.length} password{group.entries.length !== 1 ? 's' : ''}</span>
          </div>
          
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
      </div>

      <div 
        className={`transform transition-transform duration-150 ease-out ${isExpanded ? 'rotate-180' : ''}`}
      >
        <ArrowDownIcon className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
});

GroupHeader.displayName = 'GroupHeader';

export default function PasswordList({ groups, onUpdateStatus }: PasswordListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [revealedPassword, setRevealedPassword] = useState<PasswordRevealState | null>(null);
  const [animation, setAnimation] = useState(true);
  
  // Auto-hide password after 30 seconds for security
  useEffect(() => {
    if (revealedPassword) {
      const timer = setTimeout(() => {
        setRevealedPassword(null);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [revealedPassword]);

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
  
  // Disable animations temporarily (for performance during batch operations)
  const toggleAnimations = useCallback((enable: boolean) => {
    setAnimation(enable);
  }, []);

  // Sort groups by number of entries (most passwords first)
  const sortedGroups = [...groups].sort((a, b) => b.entries.length - a.entries.length);

  return (
    <div className="space-y-4">
      {sortedGroups.map((group) => (
        <div 
          key={group.url} 
          className="bg-white rounded-xl shadow p-0 transition-all duration-200 hover:shadow-md overflow-hidden"
        >
          <GroupHeader
            group={group}
            isExpanded={expandedGroups.has(group.url)}
            onToggle={() => toggleGroup(group.url)}
            onVisitSite={visitSite}
          />

          <div 
            className={`grid transition-all ${animation ? 'duration-150' : 'duration-0'} ease-in-out ${
              expandedGroups.has(group.url) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 pb-4 pt-0 space-y-3">
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