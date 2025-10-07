'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface PasswordResetFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PasswordResetForm({ onCancel, onSuccess }: PasswordResetFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    resetToken: 'MVP_RESET_TOKEN' // For MVP - in production, this would come from email
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
          resetToken: formData.resetToken
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password reset successfully! Please log in with your new password.');
        onSuccess();
      } else {
        toast.error(data.error || 'Password reset failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-[#1a1a1a] border border-[#4d4d4d] rounded-xl shadow-xl p-6 w-full max-w-md"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          Reset Password
        </h2>

        <div className="bg-[#2a2a2a] border border-[#4d4d4d] rounded-xl p-3 mb-4">
          <p className="text-sm text-[#adadad]">
            <strong className="text-white">⚠️ Important:</strong> This is an MVP version. In production, you would receive a reset token via email.
            For now, the reset token is automatically provided.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              New Password *
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full p-3 border border-[#4d4d4d] rounded-xl bg-neutral-800 text-white focus:outline-0 focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#adadad]"
              placeholder="Confirm new password"
              required
              minLength={6}
            />
          </div>

          <div className="bg-[#2a2a2a] border border-[#4d4d4d] rounded-xl p-3">
            <p className="text-sm text-[#adadad]">
              <strong className="text-white">🔐 Master Password Warning:</strong> Resetting your login password does NOT affect your master password. 
              Your vault data remains encrypted with your original master password.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-[#adadad] bg-[#363636] rounded-full hover:bg-[#4d4d4d] hover:text-white transition-colors font-medium text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-black text-white rounded-full hover:bg-[#2a2a2a] disabled:bg-[#363636] disabled:cursor-not-allowed transition-colors font-medium text-sm font-bold tracking-[0.015em]"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
