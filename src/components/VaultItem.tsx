'use client';

import React, { useState } from 'react';
import { VaultItem as VaultItemType } from '@/types';
import { Copy, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface VaultItemProps {
  item: VaultItemType;
  onEdit: (item: VaultItemType) => void;
  onDelete: (id: string) => void;
  decryptedData: {
    username: string;
    password: string;
    notes: string;
  };
}

export default function VaultItemComponent({ item, onEdit, onDelete, decryptedData }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        toast.success(`${type} cleared from clipboard for security`);
      }, 15000);
    } catch (error) {
      toast.error(`Failed to copy ${type}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item._id);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#4d4d4d] p-4 hover:border-[#666666] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
          {item.url && (
            <a
              href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#adadad] hover:text-white flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={14} />
              {item.url}
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-[#adadad] hover:text-white hover:bg-[#363636] rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-[#adadad] hover:text-red-400 hover:bg-[#363636] rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Username */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#adadad] w-20">Username:</span>
          <span className="flex-1 font-mono text-sm bg-[#2a2a2a] border border-[#4d4d4d] text-white px-3 py-2 rounded-lg">
            {decryptedData.username}
          </span>
          <button
            onClick={() => copyToClipboard(decryptedData.username, 'Username')}
            className="p-2 text-[#adadad] hover:text-white hover:bg-[#363636] rounded-lg transition-colors"
            title="Copy username"
          >
            <Copy size={14} />
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#adadad] w-20">Password:</span>
          <span className="flex-1 font-mono text-sm bg-[#2a2a2a] border border-[#4d4d4d] text-white px-3 py-2 rounded-lg">
            {showPassword ? decryptedData.password : '••••••••••••'}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-[#adadad] hover:text-white hover:bg-[#363636] rounded-lg transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={() => copyToClipboard(decryptedData.password, 'Password')}
            className="p-2 text-[#adadad] hover:text-white hover:bg-[#363636] rounded-lg transition-colors"
            title="Copy password"
          >
            <Copy size={14} />
          </button>
        </div>

        {/* Notes */}
        {decryptedData.notes && (
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-[#adadad] w-20 mt-1">Notes:</span>
            <div className="flex-1">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-sm text-[#adadad] hover:text-white flex items-center gap-1 transition-colors"
              >
                {showNotes ? 'Hide notes' : 'Show notes'}
                {showNotes ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              {showNotes && (
                <div className="mt-1 p-3 bg-[#2a2a2a] border border-[#4d4d4d] rounded-lg text-sm text-[#adadad] whitespace-pre-wrap">
                  {decryptedData.notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-[#4d4d4d]">
        <span className="text-xs text-[#666666]">
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
