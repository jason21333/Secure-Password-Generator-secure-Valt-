'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultList from '@/components/VaultList';
import { VaultItem } from '@/types';
import { LogOut } from 'lucide-react';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Fetch vault items when user is logged in
  React.useEffect(() => {
    if (user) {
      fetchVaultItems();
    }
  }, [user]);

  const fetchVaultItems = async () => {
    setVaultLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('/api/vault', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVaultItems(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch vault items:', error);
    } finally {
      setVaultLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-[#1a1a1a]"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-[#adadad]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm mode={authMode} onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} />
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#1a1a1a]"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <header className="border-b border-[#363636] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
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
              <div>
                <h1 className="text-xl font-bold text-white">Password Vault</h1>
                <p className="text-sm text-[#adadad]">Welcome back, {user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[#adadad] hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-[#363636]"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Generator */}
          <div className="order-2 lg:order-1">
            <PasswordGenerator />
          </div>

          {/* Vault */}
          <div className="order-1 lg:order-2">
            {vaultLoading ? (
              <div className="bg-[#1a1a1a] border border-[#4d4d4d] rounded-xl p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="mt-4 text-[#adadad]">Loading vault...</p>
                </div>
              </div>
            ) : (
              <VaultList items={vaultItems} onRefresh={fetchVaultItems} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#363636] mt-12 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-sm text-[#adadad]">
            <p>Password Vault - Your passwords are encrypted client-side and never stored in plain text</p>
            <p className="mt-2">Built with Next.js, TypeScript, and MongoDB</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
