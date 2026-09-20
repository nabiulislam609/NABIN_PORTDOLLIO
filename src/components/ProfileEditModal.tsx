import React, { useState, useEffect, useRef } from 'react';
import { X, Save, User, Image, Mail, Phone, MapPin, Globe, Lock, Check, AlertCircle, CheckCircle2, Upload, Trash2, Camera } from 'lucide-react';
import { ProfileConfig } from '../types.ts';
import { processImageFile } from '../utils/imageUtils.ts';

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
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [profileDragOver, setProfileDragOver] = useState(false);
  const [heroDragOver, setHeroDragOver] = useState(false);

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileFileSelect = async (file: File) => {
    try {
      setIsUploadingProfile(true);
      setProfileError(null);
      const dataUrl = await processImageFile(file, 1200, 0.88);
      setFormData((prev) => ({ ...prev, profileImage: dataUrl }));
      setProfileSuccess('Profile photo uploaded from computer!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to process image file');
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleHeroFileSelect = async (file: File) => {
    try {
      setIsUploadingHero(true);
      setProfileError(null);
      const dataUrl = await processImageFile(file, 1600, 0.85);
      setFormData((prev) => ({ ...prev, heroImage: dataUrl }));
      setProfileSuccess('Hero background photo uploaded from computer!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to process image file');
    } finally {
      setIsUploadingHero(false);
    }
  };

  useEffect(() => {
    setFormData(profile);
    setProfileError(null);
    setProfileSuccess(null);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await onSaveProfile(formData);
      setProfileSuccess('Profile updated and saved successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to save profile. Please try again.');
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
            {profileError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{profileSuccess}</span>
              </div>
            )}

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

            {/* Image Upload & URLs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Profile Portrait Image */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setProfileDragOver(true);
                }}
                onDragLeave={() => setProfileDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setProfileDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProfileFileSelect(file);
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  profileDragOver
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : 'border-[#232E45] bg-[#121826]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC]">
                    Profile Portrait Image
                  </label>
                  <span className="text-[10px] text-cyan-400 font-medium">Desktop file or URL</span>
                </div>

                <div className="flex items-center gap-3 mb-2.5">
                  {/* Thumbnail Preview */}
                  <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[#1A2438] border border-[#232E45] flex items-center justify-center relative group">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6 text-[#AAB8CE]" />
                    )}
                  </div>

                  {/* Upload button from desktop */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm ${
                        isUploadingProfile
                          ? 'bg-[#232E45] text-[#AAB8CE]'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingProfile ? 'Processing...' : 'Upload Photo from Desktop'}</span>
                      <input
                        ref={profileFileInputRef}
                        type="file"
                        accept="image/*"
                        disabled={isUploadingProfile}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProfileFileSelect(file);
                          if (e.target) e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>

                    <div className="text-[10px] text-[#AAB8CE] flex items-center justify-between">
                      <span>PNG, JPG, WEBP or GIF</span>
                      {formData.profileImage && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, profileImage: '' })}
                          className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional direct URL input */}
                <input
                  type="text"
                  placeholder="Or paste image web link..."
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1A2438] border border-[#232E45] text-xs text-white placeholder-[#5A6D88] focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Hero Background Image */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setHeroDragOver(true);
                }}
                onDragLeave={() => setHeroDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setHeroDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleHeroFileSelect(file);
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  heroDragOver
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : 'border-[#232E45] bg-[#121826]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC]">
                    Hero Background Image
                  </label>
                  <span className="text-[10px] text-cyan-400 font-medium">Desktop file or URL</span>
                </div>

                <div className="flex items-center gap-3 mb-2.5">
                  {/* Thumbnail Preview */}
                  <div className="w-20 h-14 shrink-0 rounded-xl overflow-hidden bg-[#1A2438] border border-[#232E45] flex items-center justify-center relative group">
                    {formData.heroImage ? (
                      <img
                        src={formData.heroImage}
                        alt="Hero background"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Image className="w-6 h-6 text-[#AAB8CE]" />
                    )}
                  </div>

                  {/* Upload button from desktop */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm ${
                        isUploadingHero
                          ? 'bg-[#232E45] text-[#AAB8CE]'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingHero ? 'Processing...' : 'Upload Photo from Desktop'}</span>
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="image/*"
                        disabled={isUploadingHero}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleHeroFileSelect(file);
                          if (e.target) e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>

                    <div className="text-[10px] text-[#AAB8CE] flex items-center justify-between">
                      <span>PNG, JPG, WEBP or GIF</span>
                      {formData.heroImage && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: '' })}
                          className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional direct URL input */}
                <input
                  type="text"
                  placeholder="Or paste hero background web link..."
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1A2438] border border-[#232E45] text-xs text-white placeholder-[#5A6D88] focus:outline-none focus:border-cyan-400"
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
