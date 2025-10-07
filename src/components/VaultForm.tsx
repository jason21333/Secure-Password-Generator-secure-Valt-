'use client';

import React, { useState, useEffect } from 'react';
import { VaultItem } from '@/types';
import { encryptVaultItem, decryptVaultItem, generateKey } from '@/lib/encryption';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface VaultFormProps {
  item?: VaultItem | null;
  onSave: (encryptedItem: any) => void;
  onCancel: () => void;
}

export default function VaultForm({ item, onSave, onCancel }: VaultFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });
  const [masterPassword, setMasterPassword] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        username: item.username, // Will be decrypted when master password is entered
        password: item.password, // Will be decrypted when master password is entered
        url: item.url,
        notes: item.notes, // Will be decrypted when master password is entered
      });
    }
  }, [item]);

  const handleDecrypt = () => {
    if (!masterPassword || !item || !user?.email) {
      toast.error('Master password is required');
      return;
    }

    try {
      const key = generateKey(masterPassword, user.email);
      const decrypted = decryptVaultItem({
        username: item.username,
        password: item.password,
        notes: item.notes,
      }, key);

      setFormData({
        title: item.title,
        username: decrypted.username,
        password: decrypted.password,
        url: item.url,
        notes: decrypted.notes,
      });
      setIsDecrypted(true);
      toast.success('Item decrypted successfully!');
    } catch (error) {
      toast.error('Failed to decrypt. Please check your master password.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!masterPassword) {
      toast.error('Master password is required for encryption');
      return;
    }

    if (!formData.title || !formData.username || !formData.password) {
      toast.error('Title, username, and password are required');
      return;
    }

    try {
      // Generate encryption key from master password and user email
      const key = generateKey(masterPassword, user?.email || '');
      
      // Encrypt sensitive data
      const encryptedItem = encryptVaultItem(formData, key);
      
      // Add metadata
      const itemToSave = {
        ...encryptedItem,
        title: formData.title, // Keep title unencrypted for search
        url: formData.url, // Keep URL unencrypted for convenience
        ...(item && { _id: item._id }), // Include ID for updates
      };

      onSave(itemToSave);
      toast.success(item ? 'Vault item updated!' : 'Vault item saved!');
    } catch (error) {
      toast.error('Failed to encrypt data');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-[#1a1a1a] border border-[#4d4d4d] rounded-xl shadow-xl p-6 w-full max-w-md"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {item ? 'Edit Vault Item' : 'Add New Vault Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Master Password *
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && item && !isDecrypted) {
                    e.preventDefault();
                    handleDecrypt();
                  }
                }}
                className="flex-1 p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
                placeholder="Enter your master password"
                required
              />
              {item && !isDecrypted && (
                <button
                  type="button"
                  onClick={handleDecrypt}
                  disabled={!masterPassword}
                  className="px-4 py-3 bg-[#363636] text-white rounded-full hover:bg-[#4d4d4d] disabled:bg-[#2a2a2a] disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Decrypt
                </button>
              )}
            </div>
            <p className="text-xs text-[#adadad] mt-1">
              {item && !isDecrypted 
                ? "Enter your master password and click 'Decrypt' to view existing data"
                : "This is used to encrypt/decrypt your vault data"
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="e.g., Gmail Account"
              disabled={item && !isDecrypted}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Username/Email *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="username@example.com"
              disabled={item && !isDecrypted}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="Enter password"
              disabled={item && !isDecrypted}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="https://example.com"
              disabled={item && !isDecrypted}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad] resize-none"
              rows={3}
              placeholder="Additional notes..."
              disabled={item && !isDecrypted}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-[#adadad] bg-[#363636] rounded-full hover:bg-[#4d4d4d] hover:text-white transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={item && !isDecrypted}
              className="flex-1 px-4 py-3 bg-black text-white rounded-full hover:bg-[#2a2a2a] disabled:bg-[#363636] disabled:cursor-not-allowed transition-colors font-medium text-sm font-bold tracking-[0.015em]"
            >
              {item ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
