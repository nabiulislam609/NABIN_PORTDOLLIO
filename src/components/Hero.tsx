import React, { useState, useRef, useMemo } from 'react';
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Linkedin,
  Facebook,
  Instagram,
  Github,
} from 'lucide-react';
import { ProfileConfig } from '../types.ts';
import { scrollToElement } from '../utils/scroll.ts';
import { processImageFile } from '../utils/imageUtils.ts';

interface HeroProps {
  profile: ProfileConfig;
  onExplorePortfolio: () => void;
  onContactClick: () => void;
  onUpdateHeroImage?: (newHeroUrl: string) => Promise<void> | void;
  isAdmin?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  onExplorePortfolio,
  onContactClick,
  onUpdateHeroImage,
  isAdmin = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Normalize Unsplash page links into direct stream URLs
  const resolvedHeroImage = useMemo(() => {
    if (imgError) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1800&auto=format&fit=crop';
    }
    const raw = profile.heroImage || '';
    if (raw.includes('unsplash.com/photos/') && !raw.includes('/download')) {
      return `${raw.replace(/\/$/, '')}/download?force=true`;
    }
    return raw;
  }, [profile.heroImage, imgError]);

  const handleHeroFile = async (file: File) => {
    try {
      setUploadNotice(null);
      const dataUrl = await processImageFile(file, 2400, 0.92);
      if (onUpdateHeroImage) {
        await onUpdateHeroImage(dataUrl);
      }
      setUploadNotice('Hero image updated successfully!');
      setTimeout(() => setUploadNotice(null), 3500);
    } catch (err: any) {
      setUploadNotice(err?.message || 'Failed to update image.');
      setTimeout(() => setUploadNotice(null), 4000);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isAdmin) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await handleHeroFile(file);
      }
    }
  };

  const rawPrimary = profile.title?.includes('|')
    ? profile.title.split('|')[0]?.trim()
    : profile.title?.trim();
  const primaryTitle =
    !rawPrimary || rawPrimary === 'Digital Marketer'
      ? 'Data-Driven Digital Marketer'
      : rawPrimary;
  const secondaryTitle =
    (profile.title?.includes('|')
      ? profile.title.split('|')[1]?.trim()
      : '') || 'Paid Advertising & SEO Specialist';

  return (
    <section
      id="home"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden transition-all ${
        isDragOver ? 'ring-4 ring-cyan-400/80 ring-inset bg-cyan-950/20' : ''
      }`}
    >
      {/* Hidden File Input for instant hero replacement if triggered by admin */}
      {isAdmin && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleHeroFile(e.target.files[0]);
            }
          }}
        />
      )}

      {/* Upload notice notification if triggered */}
      {uploadNotice && (
        <div className="fixed top-20 right-6 z-50 px-3.5 py-2 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {isDragOver && isAdmin && (
        <div className="absolute top-24 right-4 sm:right-8 z-30 px-3.5 py-2 rounded-xl bg-cyan-950/95 border-2 border-cyan-400 text-cyan-200 text-xs font-bold animate-pulse shadow-lg">
          Release to set as Hero Banner
        </div>
      )}

      {/* Background Image with High Visibility and Refined Cinematic Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={resolvedHeroImage}
          alt="Hero Background Banner"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000"
          style={{
            opacity: (profile.heroImageOpacity !== undefined ? profile.heroImageOpacity : 90) / 100,
          }}
        />
        {/* Soft center text-scrim so graphics, charts & portrait remain vibrant and clearly visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(10, 14, 26, 0.28) 0%, rgba(10, 14, 26, 0.08) 50%, rgba(10, 14, 26, 0.65) 100%)',
          }}
        />
        {/* Subtle ambient tint to keep harmonious dark contrast */}
        <div className="absolute inset-0 bg-[#0A0E1A]/15 backdrop-blur-[0.5px]" />
        {/* Smooth top gradient for navbar contrast */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A]/90 via-[#0A0E1A]/40 to-transparent" />
        {/* Smooth bottom fade into about section */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/70 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Credibility Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2438]/90 border border-[#3A4A63]/80 backdrop-blur-md shadow-md mb-6 animate-fade-in">
          <span
            className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--theme-primary-glow)]"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          ></span>
          <span className="text-xs font-semibold tracking-wide uppercase text-[#B8C6DC]">
            Data-Driven Performance Marketing
          </span>
        </div>

        {/* Main Headline & Professional Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F2F5FA] max-w-4xl leading-[1.15] mb-6 drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
          <span className="block">{primaryTitle}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6E0F0] via-[#B8C6DC] to-[#FFFFFF] block text-2xl sm:text-4xl md:text-5xl mt-2 font-bold">
            {secondaryTitle}
          </span>
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg md:text-xl text-[#D6E0F0] max-w-2xl leading-relaxed mb-10 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          {profile.heroDescription}
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
          <button
            onClick={onExplorePortfolio}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#232E45] via-[#3A4A63] to-[#4D6282] hover:from-[#3A4A63] hover:to-[#5E769B] text-[#F2F5FA] font-semibold text-sm sm:text-base border border-[#B8C6DC]/30 shadow-lg shadow-black/40 flex items-center justify-center gap-2 transition-all duration-200 group"
            id="hero-primary-cta"
          >
            <span>View My Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1A2438]/70 hover:bg-[#232E45] text-[#F2F5FA] font-semibold text-sm sm:text-base border border-[#3A4A63] hover:border-[#B8C6DC]/40 backdrop-blur-md transition-all duration-200"
            id="hero-secondary-cta"
          >
            Contact Me
          </button>
        </div>

        {/* Social Media Quick Links */}
        {(profile.socials?.linkedin ||
          profile.socials?.facebook ||
          profile.socials?.instagram ||
          profile.socials?.github) && (
          <div className="flex items-center justify-center gap-2.5 mb-14">
            <span className="text-xs text-[#AAB8CE] font-medium tracking-wide mr-1">
              Connect:
            </span>
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A]/80 hover:bg-[#1A2438] border border-[#232E45] hover:border-cyan-400/50 text-[#AAB8CE] hover:text-cyan-400 flex items-center justify-center transition-all shadow-sm hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.socials.facebook && (
              <a
                href={profile.socials.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook Profile"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A]/80 hover:bg-[#1A2438] border border-[#232E45] hover:border-blue-400/50 text-[#AAB8CE] hover:text-blue-400 flex items-center justify-center transition-all shadow-sm hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {profile.socials.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram Profile"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A]/80 hover:bg-[#1A2438] border border-[#232E45] hover:border-pink-400/50 text-[#AAB8CE] hover:text-pink-400 flex items-center justify-center transition-all shadow-sm hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub Profile"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A]/80 hover:bg-[#1A2438] border border-[#232E45] hover:border-white/50 text-[#AAB8CE] hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-105"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Metric / Stat Pillars */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl text-left">
          <div className="p-4 rounded-xl bg-[#0A0E1A]/85 backdrop-blur-lg border border-[#232E45] hover:border-[#3A4A63] shadow-lg shadow-black/40 transition-colors">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs text-[#B8C6DC] font-medium">Experience</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.yearsExperience}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Industry Practice</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0E1A]/85 backdrop-blur-lg border border-[#232E45] hover:border-[#3A4A63] shadow-lg shadow-black/40 transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs text-[#B8C6DC] font-medium">Ad Spend</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.adSpendManaged}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Profitable Management</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0E1A]/85 backdrop-blur-lg border border-[#232E45] hover:border-[#3A4A63] shadow-lg shadow-black/40 transition-colors">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs text-[#B8C6DC] font-medium">Average ROI</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.avgRoi}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Targeted Campaigns</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0E1A]/85 backdrop-blur-lg border border-[#232E45] hover:border-[#3A4A63] shadow-lg shadow-black/40 transition-colors">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs text-[#B8C6DC] font-medium">Success Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.completedProjects}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Delivered Campaigns</div>
          </div>
        </div>

        {/* Scroll down prompt */}
        <button
          onClick={() => scrollToElement('about', 76, 380)}
          className="mt-12 flex flex-col items-center opacity-75 hover:opacity-100 transition-all cursor-pointer group focus:outline-none"
          aria-label="Scroll down to About section"
        >
          <span className="text-xs text-[#AAB8CE] group-hover:text-cyan-400 tracking-wider uppercase mb-1 transition-colors">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 text-[#AAB8CE] group-hover:text-cyan-400 group-hover:translate-y-0.5 transition-all" />
        </button>
      </div>
    </section>
  );
};
