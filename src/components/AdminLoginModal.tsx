import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Settings,
  PlusCircle,
  Mail,
  Database,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { apiLogin } from '../services/apiService.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
  isAdmin?: boolean;
  onLogout?: () => void;
  onOpenProfileSettings?: () => void;
  onAddNewProject?: () => void;
  onOpenInquiries?: () => void;
  onOpenBackendDocs?: () => void;
  unreadInquiriesCount?: number;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isAdmin = false,
  onLogout,
  onOpenProfileSettings,
  onAddNewProject,
  onOpenInquiries,
  onOpenBackendDocs,
  unreadInquiriesCount = 0,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
      setPassword('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

      const res = await apiLogin(password);

      if (!res.success || !res.token) {
        throw new Error(res.error || 'Invalid admin credentials');
      }

      onLoginSuccess(res.token);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F2F5FA]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              isAdmin
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-[#1A2438] border-cyan-500/30 text-cyan-400'
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3
              id="admin-login-modal-title"
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              <span>{isAdmin ? 'Admin Control Hub' : 'Admin Portal Login'}</span>
              {isAdmin && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                  Active
                </span>
              )}
            </h3>
            <p className="text-xs text-[#AAB8CE]">
              {isAdmin
                ? 'Manage portfolio projects, biography, and inquiries'
                : 'CMS & Portfolio Management Authentication'}
            </p>
          </div>
        </div>

        {/* Content: Authenticated Dashboard OR Login Form */}
        {isAdmin ? (
          <div className="space-y-4">
            <p className="text-xs text-[#AAB8CE] leading-relaxed">
              Your administrator session is currently active. Select an action below to manage your site content in real time:
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {onOpenProfileSettings && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenProfileSettings();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-cyan-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        Edit Profile & Bio
                      </div>
                      <div className="text-[11px] text-[#AAB8CE]">
                        Update headline, stats, hero image, social links & password
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {onAddNewProject && (
                <button
                  onClick={() => {
                    onClose();
                    onAddNewProject();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-emerald-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        Add New Project
                      </div>
                      <div className="text-[11px] text-[#AAB8CE]">
                        Publish a new campaign case study with metrics
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {onOpenInquiries && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenInquiries();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-amber-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-500/30">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>Client Inquiries</span>
                        {unreadInquiriesCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-black font-bold rounded-full">
                            {unreadInquiriesCount} new
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#AAB8CE]">
                        Review leads and contact submissions
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {onOpenBackendDocs && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBackendDocs();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-purple-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-500/30">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        Database & API Docs
                      </div>
                      <div className="text-[11px] text-[#AAB8CE]">
                        View schemas, storage endpoints & system specs
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-[#232E45] flex items-center justify-between">
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Admin</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-[#F2F5FA] bg-[#1A2438] hover:bg-[#232E45] transition-colors ml-auto"
              >
                Close Hub
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-[#AAB8CE] mb-5 leading-relaxed">
              Log in with your administrator credential to edit biography details, add/modify portfolio case studies, and manage client inquiries.
            </p>

            {error && (
              <div className="p-3 mb-5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
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
                    placeholder="Enter admin password"
                    required
                    autoFocus
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Verifying...' : 'Unlock Admin Portal'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

