import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { ProfileConfig } from '../types.ts';

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
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Image with Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={profile.heroImage}
          alt="Digital Marketing Workspace & Analytics Dashboard"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25 scale-105 transform motion-safe:transition-transform duration-1000"
        />
        {/* Cinematic Multi-stop Gradient: Deep navy-black on left, dark slate blue in center, cool gray-blue on right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(26, 36, 56, 0.75) 0%, rgba(10, 14, 26, 0.95) 75%, #0A0E1A 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'linear-gradient(135deg, rgba(10, 14, 26, 0.92) 0%, rgba(26, 36, 56, 0.8) 45%, rgba(58, 74, 99, 0.4) 100%)',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#B8C6DC 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Credibility Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2438]/80 border border-[#3A4A63]/70 backdrop-blur-md shadow-sm mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="text-xs font-semibold tracking-wide uppercase text-[#B8C6DC]">
            Data-Driven Performance Marketing
          </span>
        </div>

        {/* Personal Name */}
        <h2 className="text-sm sm:text-base font-semibold tracking-wider text-[#AAB8CE] uppercase mb-2">
          {profile.name}
        </h2>

        {/* Main Headline & Professional Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F2F5FA] max-w-4xl leading-[1.15] mb-6">
          <span className="block">{profile.title.split('|')[0]?.trim()}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8C6DC] via-[#AAB8CE] to-[#F2F5FA] block text-2xl sm:text-4xl md:text-5xl mt-2 font-bold">
            {profile.title.split('|')[1]?.trim() || 'Paid Advertising & SEO Specialist'}
          </span>
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg md:text-xl text-[#AAB8CE] max-w-2xl leading-relaxed mb-10 font-normal">
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
          <div className="p-4 rounded-xl bg-[#1A2438]/60 backdrop-blur-md border border-[#232E45] hover:border-[#3A4A63] transition-colors">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs text-[#AAB8CE] font-medium">Experience</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.yearsExperience}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Industry Practice</div>
          </div>

          <div className="p-4 rounded-xl bg-[#1A2438]/60 backdrop-blur-md border border-[#232E45] hover:border-[#3A4A63] transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs text-[#AAB8CE] font-medium">Ad Spend</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.adSpendManaged}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Profitable Management</div>
          </div>

          <div className="p-4 rounded-xl bg-[#1A2438]/60 backdrop-blur-md border border-[#232E45] hover:border-[#3A4A63] transition-colors">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs text-[#AAB8CE] font-medium">Average ROI</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.avgRoi}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Targeted Campaigns</div>
          </div>

          <div className="p-4 rounded-xl bg-[#1A2438]/60 backdrop-blur-md border border-[#232E45] hover:border-[#3A4A63] transition-colors">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs text-[#AAB8CE] font-medium">Success Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F2F5FA]">
              {profile.stats.completedProjects}
            </div>
            <div className="text-[11px] text-[#AAB8CE] mt-0.5">Delivered Campaigns</div>
          </div>
        </div>

        {/* Scroll down prompt */}
        <div className="mt-12 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-xs text-[#AAB8CE] tracking-wider uppercase mb-1">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 text-[#AAB8CE] animate-bounce" />
        </div>
      </div>
    </section>
  );
};
