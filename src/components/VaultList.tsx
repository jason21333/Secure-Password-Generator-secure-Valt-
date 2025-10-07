'use client';

import React, { useState, useEffect } from 'react';
import { VaultItem } from '@/types';
import { decryptVaultItem, generateKey } from '@/lib/encryption';
import { useAuth } from '@/contexts/AuthContext';
import VaultItemComponent from './VaultItem';
import VaultForm from './VaultForm';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface VaultListProps {
  items: VaultItem[];
  onRefresh: () => void;
}

export default function VaultList({ items, onRefresh }: VaultListProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [decryptedItems, setDecryptedItems] = useState<Map<string, any>>(new Map());

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Decrypt items when master password is provided
  const decryptItems = async () => {
    if (!masterPassword || !user?.email) return;

    try {
      const key = generateKey(masterPassword, user.email);
      const newDecryptedItems = new Map();

      for (const item of items) {
        try {
          const decrypted = decryptVaultItem({
            username: item.username,
            password: item.password,
            notes: item.notes,
          }, key);
          newDecryptedItems.set(item._id, decrypted);
        } catch (error) {
          // If decryption fails, it might be due to wrong master password
          console.error(`Failed to decrypt item ${item._id}:`, error);
        }
      }

      setDecryptedItems(newDecryptedItems);
    } catch (error) {
      toast.error('Failed to decrypt vault items');
    }
  };

  useEffect(() => {
    if (masterPassword && items.length > 0) {
      decryptItems();
    }
  }, [masterPassword, items]);

  const handleAddNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: VaultItem) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      });

      if (response.ok) {
        toast.success('Vault item deleted!');
        onRefresh();
      } else {
        toast.error('Failed to delete vault item');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleSave = async (encryptedItem: any) => {
    try {
      const url = encryptedItem._id ? `/api/vault/${encryptedItem._id}` : '/api/vault';
      const method = encryptedItem._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
        body: JSON.stringify(encryptedItem),
      });

      if (response.ok) {
        setShowForm(false);
        onRefresh();
      } else {
        toast.error('Failed to save vault item');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">My Vault</h1>
        <button
          onClick={handleAddNew}
          className="bg-black text-white px-4 py-3 rounded-full hover:bg-[#2a2a2a] transition-colors flex items-center gap-2 font-medium text-sm font-bold tracking-[0.015em]"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      {/* Master Password Input */}
      <div className="bg-[#2a2a2a] border border-[#4d4d4d] rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          {masterPassword ? 'Master Password Set' : 'Set Master Password for Vault'}
        </h3>
        <p className="text-sm text-[#adadad] mb-3">
          <strong className="text-white">🔐 Master Password:</strong> This is different from your login password. It's used to encrypt/decrypt your vault data and is never stored on our servers.
          {masterPassword && ' If passwords appear as "Enter master password to decrypt", try re-entering your master password.'}
        </p>
        <div className="flex gap-3">
          <input
            type="password"
            value={masterPasswordInput}
            onChange={(e) => setMasterPasswordInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && masterPasswordInput) {
                setMasterPassword(masterPasswordInput);
                setMasterPasswordInput('');
              }
            }}
            className="flex-1 p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
            placeholder={masterPassword ? "Update master password" : "Enter your master password for vault encryption"}
          />
          {masterPassword ? (
            <button
              onClick={() => {
                if (masterPasswordInput) {
                  setMasterPassword(masterPasswordInput);
                  setMasterPasswordInput('');
                }
              }}
              disabled={!masterPasswordInput}
              className="px-4 py-3 bg-[#363636] text-white rounded-full hover:bg-[#4d4d4d] disabled:bg-[#2a2a2a] disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Update
            </button>
          ) : (
            <button
              onClick={() => {
                if (masterPasswordInput) {
                  setMasterPassword(masterPasswordInput);
                  setMasterPasswordInput('');
                }
              }}
              disabled={!masterPasswordInput}
              className="px-4 py-3 bg-black text-white rounded-full hover:bg-[#2a2a2a] disabled:bg-[#363636] disabled:cursor-not-allowed transition-colors font-medium text-sm font-bold tracking-[0.015em]"
            >
              Set Password
            </button>
          )}
          {masterPassword && (
            <button
              onClick={() => {
                setMasterPassword('');
                setMasterPasswordInput('');
                setDecryptedItems(new Map());
              }}
              className="px-4 py-3 bg-[#363636] text-white rounded-full hover:bg-[#4d4d4d] transition-colors font-medium text-sm"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#adadad]" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
          placeholder="Search vault items..."
        />
      </div>

      {/* Items Count */}
      <div className="mb-4">
        <p className="text-sm text-[#adadad]">
          {filteredItems.length} of {items.length} items
        </p>
      </div>

      {/* Vault Items */}
      <div className="grid gap-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#adadad] text-lg">
              {searchTerm ? 'No items match your search' : 'No vault items yet'}
            </p>
            <p className="text-[#666666] text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 'Add your first password to get started'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <VaultItemComponent
              key={item._id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              decryptedData={decryptedItems.get(item._id) || {
                username: 'Enter master password to decrypt',
                password: 'Enter master password to decrypt',
                notes: 'Enter master password to decrypt',
              }}
            />
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <VaultForm
          item={selectedItem}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
