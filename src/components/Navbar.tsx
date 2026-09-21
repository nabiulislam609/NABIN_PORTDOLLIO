import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { ProfileConfig } from '../types.ts';
import { scrollToElement } from '../utils/scroll.ts';
import { PhotoshopColorBox } from './PhotoshopColorBox.tsx';
import { DEFAULT_THEME_COLOR } from '../utils/theme.ts';

interface NavbarProps {
  profile: ProfileConfig;
  onOpenColorPicker?: () => void;
  onResetTheme?: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ profile, onOpenColorPicker, onResetTheme }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    // High performance rAF scroll listener with state guard
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 25;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Asynchronous IntersectionObserver for section highlighting (zero scroll-thread blocking)
    const sectionIds = ['home', 'about', 'services', 'portfolio', 'contact'];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section with highest intersection ratio
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          // Sort by top coordinate relative to viewport
          visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-76px 0px -40% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    scrollToElement(targetId, 76, 380);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleNavClick(e, '#home');
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0E1A]/85 backdrop-blur-md border-b border-[#232E45]/80 py-3.5 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Identity / Logo */}
        <a
          href="#home"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          id="nav-logo"
          title={profile.name}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A4A63] to-[#1A2438] border border-[#B8C6DC]/30 flex items-center justify-center text-[#F2F5FA] font-bold text-lg shadow-md group-hover:border-[#B8C6DC]/60 transition-colors">
            {profile.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#F2F5FA] tracking-tight text-base sm:text-lg flex items-center gap-1.5 group-hover:text-white transition-colors">
              {profile.name}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            </span>
            <span className="text-xs text-[#AAB8CE] font-medium tracking-wide">
              Growth & SEO Specialist
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#1A2438]/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#232E45]"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#3A4A63] text-[#F2F5FA] shadow-sm'
                    : 'text-[#AAB8CE] hover:text-[#F2F5FA] hover:bg-[#232E45]/40'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden lg:flex items-center gap-2.5">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xl bg-gradient-to-r from-[#232E45] to-[#3A4A63] hover:from-[#3A4A63] hover:to-[#4D6282] text-[#F2F5FA] border border-[#B8C6DC]/20 shadow-sm transition-all duration-200 flex items-center gap-2"
            id="nav-cta-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Let's Talk
          </a>
        </div>

        {/* Mobile Header Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F2F5FA] hover:bg-[#1A2438] rounded-xl border border-[#232E45] transition-colors cursor-pointer"
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-[#0A0E1A]/95 backdrop-blur-xl border-b border-[#232E45] px-6 py-5 shadow-2xl transition-all"
        >
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#3A4A63] text-white font-semibold'
                      : 'text-[#AAB8CE] hover:bg-[#1A2438] hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#232E45] flex flex-col gap-2.5">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#232E45] to-[#3A4A63] text-[#F2F5FA] border border-[#B8C6DC]/20 shadow"
              >
                Let's Discuss Your Project
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
