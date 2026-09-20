import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      onLoginSuccess(data.token);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F2F5FA]">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 id="admin-login-modal-title" className="text-xl font-bold text-white">
              Admin Authentication
            </h3>
            <p className="text-xs text-[#AAB8CE]">
              Portfolio Management & Content Control
            </p>
          </div>
        </div>

        <p className="text-xs text-[#AAB8CE] mb-5 leading-relaxed">
          Log in with your administrator credential to add, modify, or delete portfolio projects, update your biography & contact info, and view client inquiries.
        </p>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAB8CE] hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Helpful credential hint for first-time use */}
            <div className="mt-2 text-[11px] text-[#AAB8CE] flex items-center gap-1.5 bg-[#1A2438]/50 p-2 rounded-lg border border-[#232E45]">
              <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Default initial password: <code className="text-cyan-300 font-bold bg-[#0A0E1A] px-1.5 py-0.5 rounded">admin</code> (customizable in settings)
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#AAB8CE] hover:text-white bg-[#1A2438] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Verifying...' : 'Unlock Admin Mode'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
