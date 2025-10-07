'use client';

import React, { useState } from 'react';
import { generatePassword, getPasswordStrength } from '@/lib/passwordGenerator';
import { PasswordGeneratorOptions } from '@/types';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Wand } from './Wand';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
    excludeLookalikes: true,
  });

  const generateNewPassword = () => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      toast.success('Password generated!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied to clipboard!');
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        setPassword('');
        toast.success('Password cleared from clipboard for security');
      }, 15000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!password) {
        generateNewPassword();
      } else {
        copyToClipboard();
      }
    }
  };

  const strength = password ? getPasswordStrength(password) : null;

  return (
    <div 
      className="relative flex size-full min-h-screen flex-col bg-[#1a1a1a] overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#363636] px-6 py-4">
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Password Generator</h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 md:px-20 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Generate a Strong Password
          </h2>

          {/* Generated Password Display */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Generated Password</p>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  onKeyPress={handleKeyPress}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#4d4d4d] bg-neutral-800 focus:border-[#4d4d4d] h-14 placeholder:text-[#adadad] p-[15px] text-base font-normal leading-normal font-mono"
                  placeholder="Generated password will appear here - Press Enter to copy"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#adadad] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {strength && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-[#adadad]">Strength:</span>
                  <span className={`text-sm font-medium ${strength.color === 'text-green-600' ? 'text-green-400' : strength.color === 'text-yellow-600' ? 'text-yellow-400' : strength.color === 'text-red-600' ? 'text-red-400' : 'text-white'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-stretch">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#363636] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4d4d4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">Copy to Clipboard</span>
              </button>
              <button
                onClick={generateNewPassword}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-10 px-4 bg-green-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-700 transition-colors"
              >
                <Wand width={20} height={20} stroke="#ffffff" />
                <span className="truncate">Generate Password</span>
              </button>
            </div>
          </div>

          {/* Password Options */}
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Password Options
          </h3>

          {/* Length Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Password Length</p>
              <input
                type="number"
                min="4"
                max="64"
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) || 16 })}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#4d4d4d] bg-neutral-800 focus:border-[#4d4d4d] h-14 placeholder:text-[#adadad] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          {/* Checkbox Options */}
          <div className="px-4">
            <label className="flex gap-x-3 py-3 flex-row cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                className="h-5 w-5 rounded border-[#4d4d4d] border-2 bg-transparent text-black checked:bg-black checked:border-black checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#4d4d4d] focus:outline-none"
                style={{ '--checkbox-tick-svg': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'rgb(255,255,255)\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")' } as React.CSSProperties}
              />
              <p className="text-white text-base font-normal leading-normal">Include Uppercase Letters</p>
            </label>
            
            <label className="flex gap-x-3 py-3 flex-row cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                className="h-5 w-5 rounded border-[#4d4d4d] border-2 bg-transparent text-black checked:bg-black checked:border-black checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#4d4d4d] focus:outline-none"
                style={{ '--checkbox-tick-svg': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'rgb(255,255,255)\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")' } as React.CSSProperties}
              />
              <p className="text-white text-base font-normal leading-normal">Include Lowercase Letters</p>
            </label>
            
            <label className="flex gap-x-3 py-3 flex-row cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                className="h-5 w-5 rounded border-[#4d4d4d] border-2 bg-transparent text-black checked:bg-black checked:border-black checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#4d4d4d] focus:outline-none"
                style={{ '--checkbox-tick-svg': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'rgb(255,255,255)\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")' } as React.CSSProperties}
              />
              <p className="text-white text-base font-normal leading-normal">Include Numbers</p>
            </label>
            
            <label className="flex gap-x-3 py-3 flex-row cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                className="h-5 w-5 rounded border-[#4d4d4d] border-2 bg-transparent text-black checked:bg-black checked:border-black checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#4d4d4d] focus:outline-none"
                style={{ '--checkbox-tick-svg': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'rgb(255,255,255)\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")' } as React.CSSProperties}
              />
              <p className="text-white text-base font-normal leading-normal">Include Symbols</p>
            </label>

            <label className="flex gap-x-3 py-3 flex-row cursor-pointer">
              <input
                type="checkbox"
                checked={options.excludeLookalikes}
                onChange={(e) => setOptions({ ...options, excludeLookalikes: e.target.checked })}
                className="h-5 w-5 rounded border-[#4d4d4d] border-2 bg-transparent text-black checked:bg-black checked:border-black checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#4d4d4d] focus:outline-none"
                style={{ '--checkbox-tick-svg': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'rgb(255,255,255)\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")' } as React.CSSProperties}
              />
              <p className="text-white text-base font-normal leading-normal">Exclude Lookalikes (0, O, I, l)</p>
            </label>
          </div>

          {/* Quick Tips */}
          <div className="px-4 pt-4">
            <div className="bg-[#2a2a2a] border border-[#4d4d4d] rounded-xl p-4">
              <p className="text-white text-sm font-medium mb-2">
                💡 Quick Tips:
              </p>
              <ul className="text-[#adadad] text-sm space-y-1">
                <li>• Press <strong className="text-white">Enter</strong> in the password field to copy it to clipboard</li>
                <li>• Password auto-clears from clipboard after 15 seconds for security</li>
                <li>• Use the "Set Password" button in vault to set your master password for encryption</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
