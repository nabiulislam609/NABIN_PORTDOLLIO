import React from 'react';
import { CheckCircle2, Compass, Layers, ShieldCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { ProfileConfig } from '../types.ts';

interface AboutProps {
  profile: ProfileConfig;
  onWorkTogetherClick: () => void;
}

export const About: React.FC<AboutProps> = ({ profile, onWorkTogetherClick }) => {
  return (
    <section id="about" className="py-24 relative z-10 border-t border-[#232E45]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2438] border border-[#232E45] text-xs font-semibold text-[#B8C6DC] uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>About The Specialist</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F5FA] tracking-tight">
            Bridging Creative Growth with Data-Driven Science
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-[#3A4A63] rounded-full mt-4"></div>
        </div>

        {/* Grid: Left Profile Card, Right Bio & Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Profile Image Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-md">
              {/* Decorative background glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-500/20 via-[#3A4A63]/30 to-indigo-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>

              {/* Profile Card */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1A2438] border border-[#3A4A63]/60 shadow-2xl p-3">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0A0E1A]">
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle dark bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent opacity-80" />

                  {/* Location badge on photo */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-md bg-[#0A0E1A]/80 border border-[#232E45] px-3.5 py-2 rounded-xl">
                    <div className="flex items-center gap-2 text-xs text-[#F2F5FA]">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      Open for Projects
                    </span>
                  </div>
                </div>

                {/* Identity sub-panel */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#F2F5FA]">{profile.name}</h3>
                    <p className="text-xs text-[#AAB8CE]">{profile.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-cyan-300">Verified Pro</div>
                    <div className="text-[11px] text-[#AAB8CE]">6+ Yrs Track Record</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Introduction & Strengths */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Philosophy & Background
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F2F5FA] mt-1.5 mb-4 leading-snug">
                Helping businesses transform digital presence into measurable business revenue.
              </h3>
              <p className="text-base text-[#AAB8CE] leading-relaxed mb-4">
                {profile.aboutBio}
              </p>
              <p className="text-base text-[#AAB8CE] leading-relaxed">
                {profile.workApproach}
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="border-t border-b border-[#232E45]/80 py-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8C6DC] mb-3">
                Core Strengths & Execution Focus
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.mainStrengths.map((strength, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F2F5FA] bg-[#1A2438]/50 p-2.5 rounded-xl border border-[#232E45]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Focus */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#1A2438] to-[#232E45]/50 border border-[#3A4A63]/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Target Partnerships
              </div>
              <p className="text-xs sm:text-sm text-[#B8C6DC] leading-relaxed">
                {profile.careerFocus}
              </p>
            </div>

            {/* CTA button */}
            <div className="pt-2">
              <button
                onClick={onWorkTogetherClick}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#232E45] to-[#3A4A63] hover:from-[#3A4A63] hover:to-[#4D6282] text-[#F2F5FA] font-semibold text-sm border border-[#B8C6DC]/20 shadow-md flex items-center gap-2 transition-all group"
                id="about-work-together-btn"
              >
                <span>Let's Work Together</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
