import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Sparkles,
} from 'lucide-react';
import { ProfileConfig } from '../types.ts';

interface ContactProps {
  profile: ProfileConfig;
  prefilledSubject?: string;
}

export const Contact: React.FC<ContactProps> = ({ profile, prefilledSubject = '' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(prefilledSubject || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(`Inquiry: ${prefilledSubject}`);
    }
  }, [prefilledSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setSuccessMsg(data.message || 'Thank you! Your message has been received.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error submitting message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsappNumber = profile.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="py-24 relative z-10 border-t border-[#232E45]/60 bg-[#0A0E1A]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2438] border border-[#232E45] text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start A Conversation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F2F5FA] tracking-tight">
            Let's discuss your next project.
          </h2>
          <p className="mt-3 text-base text-[#AAB8CE] max-w-xl">
            Whether you are looking to scale paid ad ROAS, audit local search presence, or establish tracking architecture, I am here to help.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-[#3A4A63] rounded-full mt-4"></div>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Info Cards & Socials */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-2">Direct Contact Channels</h3>

              {/* Email Card */}
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A2438]/60 hover:bg-[#1A2438] border border-[#232E45] hover:border-[#3A4A63] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#AAB8CE] block">Official Email</span>
                  <span className="text-sm sm:text-base font-semibold text-[#F2F5FA] group-hover:text-white">
                    {profile.email}
                  </span>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A2438]/60 hover:bg-[#1A2438] border border-[#232E45] hover:border-[#3A4A63] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#AAB8CE] block">Phone / Mobile</span>
                  <span className="text-sm sm:text-base font-semibold text-[#F2F5FA] group-hover:text-white">
                    {profile.phone}
                  </span>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20${encodeURIComponent(profile.name)},%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20digital%20marketing%20project.`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A2438]/60 hover:bg-[#1A2438] border border-[#232E45] hover:border-emerald-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-emerald-400 font-semibold block flex items-center gap-1.5">
                    WhatsApp Instant Chat
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#F2F5FA] group-hover:text-white">
                    {profile.whatsapp}
                  </span>
                </div>
              </a>

              {/* Location Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A2438]/40 border border-[#232E45]">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#AAB8CE] block">Primary Location</span>
                  <span className="text-sm sm:text-base font-semibold text-[#F2F5FA]">
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C6DC] block mb-3">
                Follow On Professional Channels
              </span>
              <div className="flex items-center gap-2.5">
                {profile.socials.linkedin && (
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-[#3A4A63] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-10 h-10 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-[#3A4A63] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-10 h-10 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-[#3A4A63] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-10 h-10 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-[#3A4A63] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-10 h-10 rounded-xl bg-[#1A2438] hover:bg-[#232E45] border border-[#232E45] hover:border-[#3A4A63] text-[#AAB8CE] hover:text-white flex items-center justify-center transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#1A2438]/70 border border-[#232E45] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-2">Send an Inquiry</h3>
              <p className="text-xs sm:text-sm text-[#AAB8CE] mb-6">
                Fill in the form below and I will review your business goals and respond within 24 hours.
              </p>

              {successMsg && (
                <div className="p-4 mb-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-sm flex items-start gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Inquiry Sent Successfully!</div>
                    <div className="text-xs mt-0.5 text-emerald-200">{successMsg}</div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 mb-6 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0E1A] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah@company.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0E1A] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                    Subject / Project Focus
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Meta Ads Scaling & Tracking Setup"
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0E1A] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your current marketing goals, timeline, or current challenges..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0E1A] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
                  id="contact-submit-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Delivering Message...' : 'Send Project Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
