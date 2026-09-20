import React, { useState, useEffect } from 'react';
import { X, Save, User, Image, Mail, Phone, MapPin, Globe, Lock, Check } from 'lucide-react';
import { ProfileConfig } from '../types.ts';

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: ProfileConfig;
  onClose: () => void;
  onSaveProfile: (updated: ProfileConfig) => Promise<void>;
  onChangePassword: (newPassword: string) => Promise<void>;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
  onChangePassword,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [formData, setFormData] = useState<ProfileConfig>(profile);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile(formData);
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setPasswordMsg('Password must be at least 4 characters');
      return;
    }
    try {
      await onChangePassword(newPassword);
      setPasswordMsg('Admin password updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg('Failed to update password');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F2F5FA]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Personalization Settings
          </span>
          <h2 id="profile-edit-modal-title" className="text-2xl font-bold text-white mt-1">
            Site Profile & Identity
          </h2>
          <p className="text-xs sm:text-sm text-[#AAB8CE] mt-1">
            Update personal marketing credentials, biography, contact details, and images.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#232E45] pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#3A4A63] text-white'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#1A2438]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Bio Details</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-[#3A4A63] text-white'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#1A2438]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Hero Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                Hero Tagline / Short Description
              </label>
              <textarea
                rows={2}
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* About Biography */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                About Me Biography
              </label>
              <textarea
                rows={3}
                value={formData.aboutBio}
                onChange={(e) => setFormData({ ...formData, aboutBio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Work Approach */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                Work Approach & Philosophy
              </label>
              <textarea
                rows={2}
                value={formData.workApproach}
                onChange={(e) => setFormData({ ...formData, workApproach: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Image URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Profile Portrait Image URL
                </label>
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A2438] border border-[#232E45] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A2438] border border-[#232E45] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A2438] border border-[#232E45] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A2438] border border-[#232E45] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Stats Metrics */}
            <div className="p-4 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C6DC] block mb-3">
                Key Performance Metrics (Hero Stats)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-[#AAB8CE] mb-1">Years Experience</label>
                  <input
                    type="text"
                    value={formData.stats.yearsExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stats: { ...formData.stats, yearsExperience: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A0E1A] border border-[#232E45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#AAB8CE] mb-1">Ad Spend Managed</label>
                  <input
                    type="text"
                    value={formData.stats.adSpendManaged}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stats: { ...formData.stats, adSpendManaged: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A0E1A] border border-[#232E45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#AAB8CE] mb-1">Average ROI</label>
                  <input
                    type="text"
                    value={formData.stats.avgRoi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stats: { ...formData.stats, avgRoi: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A0E1A] border border-[#232E45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#AAB8CE] mb-1">Completed Projects</label>
                  <input
                    type="text"
                    value={formData.stats.completedProjects}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stats: { ...formData.stats, completedProjects: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A0E1A] border border-[#232E45] text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#232E45] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#AAB8CE] hover:text-white bg-[#1A2438] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                New Admin Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new admin password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {passwordMsg && (
              <div className="p-3 rounded-xl bg-[#1A2438] border border-cyan-500/30 text-xs text-cyan-300">
                {passwordMsg}
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
