import { PasswordGeneratorOptions } from '@/types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Characters that look similar and should be excluded
const LOOKALIKES = '0OIl1l';

export function generatePassword(options: PasswordGeneratorOptions): string {
  let charset = '';

  if (options.includeUppercase) {
    charset += UPPERCASE;
  }
  if (options.includeLowercase) {
    charset += LOWERCASE;
  }
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  if (options.includeSymbols) {
    charset += SYMBOLS;
  }

  if (options.excludeLookalikes) {
    charset = charset.split('').filter(char => !LOOKALIKES.includes(char)).join('');
  }

  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Common patterns (penalty)
  if (/(.)\1{2,}/.test(password)) score -= 1; // repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // sequential patterns
  
  const strengthLevels = [
    { score: 0, label: 'Very Weak', color: 'text-red-500' },
    { score: 1, label: 'Weak', color: 'text-red-400' },
    { score: 2, label: 'Fair', color: 'text-yellow-500' },
    { score: 3, label: 'Good', color: 'text-yellow-400' },
    { score: 4, label: 'Strong', color: 'text-green-500' },
    { score: 5, label: 'Very Strong', color: 'text-green-600' },
  ];
  
  const level = strengthLevels[Math.max(0, Math.min(score, strengthLevels.length - 1))];
  return { score, ...level };
}
