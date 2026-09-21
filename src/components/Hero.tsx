import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { ProfileConfig } from '../types.ts';
import { scrollToElement } from '../utils/scroll.ts';

interface HeroProps {
  profile: ProfileConfig;
  onExplorePortfolio: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  onExplorePortfolio,
  onContactClick,
}) => {
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
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Image with High Visibility and Refined Cinematic Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={profile.heroImage}
          alt="Hero Background Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000"
          style={{
            opacity: (profile.heroImageOpacity !== undefined ? profile.heroImageOpacity : 80) / 100,
          }}
        />
        {/* Soft center text-scrim so graphics, charts & portrait remain vibrant and clearly visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(10, 14, 26, 0.40) 0%, rgba(10, 14, 26, 0.15) 50%, rgba(10, 14, 26, 0.65) 100%)',
          }}
        />
        {/* Subtle ambient tint to keep harmonious dark contrast */}
        <div className="absolute inset-0 bg-[#0A0E1A]/30 backdrop-blur-[0.5px]" />
        {/* Smooth top gradient for navbar contrast */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A]/90 via-[#0A0E1A]/40 to-transparent" />
        {/* Smooth bottom fade into about section */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/70 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Credibility Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2438]/90 border border-[#3A4A63]/80 backdrop-blur-md shadow-md mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
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
