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
    const yearsToCrack = secondsToCrack / 31536000; // seconds in a year
    const lightYearInKm = 9.461e12; // kilometers in a light year
    
    // Fun easter eggs and capped universe ages
    if (yearsToCrack > 1e20) {
      crackTime = "Not even quantum computers running until the heat death of the universe";
    } else if (yearsToCrack > 1e15) {
      crackTime = "The Earth will be consumed by the Sun first";
    } else if (yearsToCrack > 1e12) { // > 1 trillion years
      const universeAges = Math.min(1000, yearsToCrack / 13.8e9); // Cap at 1000x universe age
      if (universeAges > 100) {
        crackTime = `${universeAges.toLocaleString(undefined, { maximumFractionDigits: 0 })} × age of universe (perfect for your homework folder)`;
      } else {
        crackTime = `${universeAges.toLocaleString(undefined, { maximumFractionDigits: 0 })} × age of universe`;
      }
    } else if (yearsToCrack > 1e6) { // > 1 million years
      const lightYears = (yearsToCrack * 299792) / lightYearInKm;
      if (lightYears > 100000) {
        crackTime = "Longer than your Netflix queue will take to watch";
      } else {
        crackTime = `${lightYears.toLocaleString(undefined, { maximumFractionDigits: 0 })} light-years (space nerds will love this)`;
      }
    } else if (yearsToCrack > 1000) { // > 1000 years
      if (yearsToCrack > 100000) {
        crackTime = "Longer than humans have been around :)";
      } else {
        crackTime = `${Math.floor(yearsToCrack).toLocaleString()} years (your great-great-grandkids say hi)`;
      }
    } else if (yearsToCrack > 1) { // > 1 year
      if (yearsToCrack > 100) {
        crackTime = `${Math.floor(yearsToCrack)} years (about as long as your gym membership will last)`;
      } else {
        crackTime = `${Math.floor(yearsToCrack)} years`;
      }
    } else if (secondsToCrack > 86400) { // > 1 day
      if (secondsToCrack > 86400 * 30) {
        crackTime = `${Math.floor(secondsToCrack / 86400)} days (longer than your average New Year's resolution)`;
      } else {
        crackTime = `${Math.floor(secondsToCrack / 86400)} days`;
      }
    } else if (secondsToCrack > 3600) { // > 1 hour
      if (secondsToCrack > 3600 * 10) {
        crackTime = `${Math.floor(secondsToCrack / 3600)} hours`;
      } else {
        crackTime = `${Math.floor(secondsToCrack / 3600)} hours`;
      }
    } else if (secondsToCrack > 60) { // > 1 minute
      crackTime = `${Math.floor(secondsToCrack / 60)} minutes (make a coffee while you wait)`;
    } else if (secondsToCrack > 1) {
      crackTime = `${Math.floor(secondsToCrack)} seconds (faster than your last relationship)`;
    } else {
      crackTime = "Instantly. My grandmother could crack this.";
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
        <div className={`relative font-mono text-xl p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 break-all transition-all duration-300 ${
          isGenerating ? 'blur-sm scale-98' : ''
        }`}>
          <div className="absolute inset-0.5 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl" />
          <div className="relative font-medium tracking-wide">
            {password || 'Generating...'}
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </div>
        <button
          onClick={copyToClipboard}
          disabled={!password}
          className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 ${
            copied 
              ? 'bg-green-50 text-green-600 ring-2 ring-green-500/20' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700 hover:scale-105'
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
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Entropy</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{stats.entropy} bits</div>
            <div className="text-xs text-blue-600/70 mt-1">Higher is better</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-100 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <BoltIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Combinations</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{stats.combinations}</div>
            <div className="text-xs text-purple-600/70 mt-1">Possible variations</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-100 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Time to Crack</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{stats.crackTime}</div>
            <div className="text-xs text-emerald-600/70 mt-1">At 100B guesses/second</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Length Slider */}
        <div className="lg:col-span-1">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Length: {options.length}</label>
              <span className={`text-xs px-3 py-1 rounded-full font-medium transition-colors duration-300 ${
                calculateStrength() >= 80 
                  ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700'
                  : calculateStrength() >= 60
                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700'
                    : calculateStrength() >= 40
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700'
                      : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700'
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
            <div className="relative">
              <input
                type="range"
                min="6"
                max="32"
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">6</span>
                <span className="text-xs text-gray-500">32</span>
              </div>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="mt-6">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
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
            className={`w-full mt-6 py-3.5 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate New Password'}
            </div>
          </button>
        </div>

        {/* Right Column: Character Types */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'uppercase' as const, label: 'ABC', desc: 'Uppercase Letters', example: 'A-Z' },
              { key: 'lowercase' as const, label: 'abc', desc: 'Lowercase Letters', example: 'a-z' },
              { key: 'numbers' as const, label: '123', desc: 'Numbers', example: '0-9' },
              { key: 'symbols' as const, label: '#@!', desc: 'Special Characters', example: '!@#$%^&*' }
            ].map(({ key, label, desc, example }) => (
              <label
                key={key}
                onClick={(e) => {
                  e.preventDefault();
                  const newOptions = { ...options, [key]: !options[key] };
                  if (Object.values(newOptions).some(v => v)) {
                    setOptions(newOptions);
                  }
                }}
                className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  options[key]
                    ? 'bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100/50 text-gray-500 border-gray-200 hover:bg-gray-100'
                } border hover:scale-[1.02]`}>
                <div className="flex flex-col">
                  <span className="font-medium text-lg">{label}</span>
                  <span className="text-xs opacity-75">{desc}</span>
                  <span className="text-[10px] opacity-60 mt-0.5">{example}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                  options[key]
                    ? 'bg-blue-600 border-transparent scale-110'
                    : 'bg-white border-gray-300 group-hover:border-gray-400'
                }`}>
                  {options[key] && (
                    <CheckIcon className="w-4 h-4 text-white mx-auto mt-0.5" />
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