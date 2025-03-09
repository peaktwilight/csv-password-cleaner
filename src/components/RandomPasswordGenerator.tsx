import { useState, useEffect } from 'react';
import { CheckIcon, ClipboardIcon, SparklesIcon, ShieldCheckIcon, BoltIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface PasswordStats {
  entropy: number;
  crackTime: string;
  combinations: string;
}

export default function RandomPasswordGenerator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<PasswordStats | null>(null);

  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const calculatePasswordStats = (pwd: string, opts: PasswordOptions): PasswordStats => {
    // Calculate character set size
    let poolSize = 0;
    if (opts.uppercase) poolSize += 26;
    if (opts.lowercase) poolSize += 26;
    if (opts.numbers) poolSize += 10;
    if (opts.symbols) poolSize += 33;

    // Calculate entropy (bits)
    const entropy = Math.floor(pwd.length * Math.log2(poolSize));

    // Calculate possible combinations (as string due to large numbers)
    const combinations = Math.pow(poolSize, pwd.length).toLocaleString('fullwide', { useGrouping: false });
    
    // Estimate crack time (assuming 100 billion guesses per second)
    const guessesPerSecond = 1e11; // 100 billion
    const secondsToCrack = Number(combinations) / guessesPerSecond;
    
    let crackTime: string;
    if (entropy >= 128) {
      crackTime = "trillions of years";
    } else if (entropy >= 80) {
      crackTime = "millions of years";
    } else if (entropy >= 60) {
      crackTime = "thousands of years";
    } else if (secondsToCrack > 31536000) { // > 1 year
      crackTime = `${Math.floor(secondsToCrack / 31536000)} years`;
    } else if (secondsToCrack > 86400) { // > 1 day
      crackTime = `${Math.floor(secondsToCrack / 86400)} days`;
    } else if (secondsToCrack > 3600) { // > 1 hour
      crackTime = `${Math.floor(secondsToCrack / 3600)} hours`;
    } else if (secondsToCrack > 60) { // > 1 minute
      crackTime = `${Math.floor(secondsToCrack / 60)} minutes`;
    } else {
      crackTime = `${Math.floor(secondsToCrack)} seconds`;
    }

    return {
      entropy,
      crackTime,
      combinations: combinations.length > 20 
        ? `${combinations.slice(0, 10)}...${combinations.slice(-5)} (${combinations.length} digits)`
        : combinations.toLocaleString()
    };
  };

  const generatePassword = () => {
    setIsGenerating(true);
    let chars = '';
    if (options.uppercase) chars += characterSets.uppercase;
    if (options.lowercase) chars += characterSets.lowercase;
    if (options.numbers) chars += characterSets.numbers;
    if (options.symbols) chars += characterSets.symbols;

    if (!chars) {
      setPassword('');
      setIsGenerating(false);
      return;
    }

    // Animated generation effect
    let tempPassword = '';
    let counter = 0;
    const interval = setInterval(() => {
      tempPassword = Array(options.length)
        .fill(0)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join('');
      setPassword(tempPassword);
      
      counter++;
      if (counter > 5) {
        clearInterval(interval);
        setIsGenerating(false);
        // Calculate stats for final password
        setStats(calculatePasswordStats(tempPassword, options));
      }
    }, 40);
  };

  // Update stats when options change
  useEffect(() => {
    if (password) {
      setStats(calculatePasswordStats(password, options));
    }
  }, [options, password]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Generate password when options change
  useEffect(() => {
    generatePassword();
  }, [options]);

  const strengthColor = () => {
    if (!stats) return 'bg-gray-300';
    if (stats.entropy >= 128) return 'bg-emerald-500';
    if (stats.entropy >= 80) return 'bg-green-500';
    if (stats.entropy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateStrength = () => {
    if (!stats) return 0;
    return Math.min(100, (stats.entropy / 128) * 100);
  };

  return (
    <div>
      {/* Password Display */}
      <div className="relative mb-8">
        <div className={`relative font-mono text-lg p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 break-all transition-all duration-200 shadow-sm ${
          isGenerating ? 'blur-sm' : ''
        }`}>
          <div className="font-medium">{password || 'Generating...'}</div>
        </div>
        <button
          onClick={copyToClipboard}
          disabled={!password}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
            copied 
              ? 'bg-green-50 text-green-600' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          {copied ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <ClipboardIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Password Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Entropy</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{stats.entropy} bits</div>
            <div className="text-xs text-gray-500 mt-1">Higher is better</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <BoltIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Combinations</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{stats.combinations}</div>
            <div className="text-xs text-gray-500 mt-1">Possible variations</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Time to Crack</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{stats.crackTime}</div>
            <div className="text-xs text-gray-500 mt-1">At 100B guesses/second</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Length Slider */}
        <div className="lg:col-span-1">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Length: {options.length}</label>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                calculateStrength() >= 80 
                  ? 'bg-emerald-50 text-emerald-700'
                  : calculateStrength() >= 60
                    ? 'bg-green-50 text-green-700'
                    : calculateStrength() >= 40
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
              }`}>
                {calculateStrength() >= 80 
                  ? 'Very Strong'
                  : calculateStrength() >= 60
                    ? 'Strong'
                    : calculateStrength() >= 40
                      ? 'Good'
                      : 'Weak'}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">8</span>
              <span className="text-xs text-gray-500">32</span>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="mt-6">
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${strengthColor()} transition-all duration-500 ease-out`} 
                style={{
                  width: `${calculateStrength()}%`
                }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            disabled={isGenerating}
            className={`w-full mt-6 py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow'
            }`}
          >
            <SparklesIcon className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate New Password'}
          </button>
        </div>

        {/* Right Column: Character Types */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'uppercase' as const, label: 'ABC', desc: 'Uppercase' },
              { key: 'lowercase' as const, label: 'abc', desc: 'Lowercase' },
              { key: 'numbers' as const, label: '123', desc: 'Numbers' },
              { key: 'symbols' as const, label: '#@!', desc: 'Symbols' }
            ].map(({ key, label, desc }) => (
              <label
                key={key}
                onClick={(e) => {
                  e.preventDefault();
                  // Prevent disabling all options
                  const newOptions = { ...options, [key]: !options[key] };
                  if (Object.values(newOptions).some(v => v)) {
                    setOptions(newOptions);
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  options[key]
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                } border`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs opacity-75">{desc}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  options[key]
                    ? 'bg-blue-600 border-transparent'
                    : 'bg-white border-gray-300'
                }`}>
                  {options[key] && (
                    <CheckIcon className="w-3 h-3 text-white mx-auto mt-0.5" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 