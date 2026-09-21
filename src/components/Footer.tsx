import React from 'react';
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  ArrowUp,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { ProfileConfig } from '../types.ts';

interface FooterProps {
  profile: ProfileConfig;
  onOpenAdminLogin?: () => void;
  onOpenBackendDocs?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  onOpenAdminLogin,
  onOpenBackendDocs,
  onNavigateToAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[#232E45] text-[#AAB8CE] relative z-10 pt-16 pb-12 transition-colors duration-300"
      style={{ backgroundColor: 'var(--site-footer-bg, #0A0E1A)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#232E45]/70">
          {/* Identity & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A4A63] to-[#1A2438] border border-[#B8C6DC]/30 flex items-center justify-center text-[#F2F5FA] font-bold text-lg">
                {profile.name.charAt(0)}
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                {profile.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-[#AAB8CE]">
              Performance-driven Digital Marketer specializing in scalable Meta & Google advertising, technical local SEO, and full-funnel tracking architecture.
            </p>

            <div className="flex items-center gap-2 pt-2">
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-9 h-9 rounded-lg bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socials.twitter && (
                <a
                  href={profile.socials.twitter}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-9 h-9 rounded-lg bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socials.facebook && (
                <a
                  href={profile.socials.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-9 h-9 rounded-lg bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profile.socials.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-9 h-9 rounded-lg bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-9 h-9 rounded-lg bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-cyan-300 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-300 transition-colors">About Specialist</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">Capabilities</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-300 transition-colors">Case Studies</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-300 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Top Services Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">Meta Advertising (FB & IG)</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">Google Ads & Performance Max</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">Local SEO & Google 3-Pack</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">Pixel Setup & CAPI Tracking</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">Google Analytics 4 & GTM</a>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Admin */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-[#AAB8CE]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAB8CE]">
          <p>© {currentYear} {profile.name}. All Rights Reserved.</p>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#1A2438] hover:bg-[#232E45] text-[#F2F5FA] border border-[#232E45] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Back to Top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
