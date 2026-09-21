import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Target,
  Wrench,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import { Project } from '../types.ts';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  onClose,
}) => {
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (project?.image) list.push(project.image);
    if (Array.isArray(project?.images)) {
      project.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0
      ? list
      : ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop'];
  }, [project]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl text-[#F2F5FA] flex flex-col">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Case Study"
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-[#0A0E1A]/80 backdrop-blur-md text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] border border-[#232E45] transition-colors shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Slider & Header */}
        <div className="relative aspect-[16/9] sm:aspect-[16/7.5] w-full overflow-hidden bg-[#151F36] group select-none">
          <img
            key={activeImageIndex}
            src={allImages[activeImageIndex]}
            alt={`${project.title} - Visual ${activeImageIndex + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-300 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent pointer-events-none" />

          {/* Multiple Images Navigation Controls */}
          {allImages.length > 1 && (
            <>
              {/* Previous / Next Arrow Buttons */}
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous project image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0A0E1A]/80 hover:bg-cyan-950/90 border border-white/10 hover:border-cyan-400 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next project image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0A0E1A]/80 hover:bg-cyan-950/90 border border-white/10 hover:border-cyan-400 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Photo Counter Pill in Top-Left */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#0A0E1A]/85 backdrop-blur-md border border-[#232E45] text-xs font-semibold text-cyan-300 flex items-center gap-1.5 shadow-md">
                <Images className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {activeImageIndex + 1} / {allImages.length}
                </span>
              </div>
            </>
          )}

          {/* Overlaid Title & Category */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 pointer-events-none">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                {project.category}
              </span>
              {project.clientIndustry && (
                <span className="px-3 py-1 rounded-lg bg-[#1A2438]/80 border border-[#232E45] text-[#B8C6DC] text-xs font-medium flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#AAB8CE]" />
                  {project.clientIndustry}
                </span>
              )}
              {project.date && (
                <span className="px-3 py-1 rounded-lg bg-[#1A2438]/80 border border-[#232E45] text-[#AAB8CE] text-xs font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.date}
                </span>
              )}
            </div>

            <h2 id="case-study-title" className="text-xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Thumbnail Navigation Strip if Multiple Images */}
        {allImages.length > 1 && (
          <div className="px-4 sm:px-8 py-3 bg-[#0D1424] border-b border-[#232E45] flex items-center gap-2.5 overflow-x-auto">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#AAB8CE] shrink-0 mr-1 flex items-center gap-1">
              <Images className="w-3 h-3 text-cyan-400" />
              <span>Gallery:</span>
            </span>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative shrink-0 w-16 h-11 sm:w-20 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105'
                    : 'border-[#232E45] opacity-60 hover:opacity-100 hover:border-[#3A4A63]'
                }`}
                title={`View image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Key Measurable Outcome Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1A2438] to-[#232E45] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Verified Campaign Outcome
                </span>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {project.results}
                </p>
              </div>
            </div>

            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 px-4 py-2 rounded-xl bg-[#0A0E1A] hover:bg-[#1A2438] text-xs font-semibold text-[#F2F5FA] border border-[#3A4A63] flex items-center gap-2 transition-colors"
              >
                <span>Live Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Overview & Objective */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C6DC] block mb-2">
                Project Overview
              </span>
              <p className="text-xs sm:text-sm text-[#AAB8CE] leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Objectives & Goals
              </span>
              <p className="text-xs sm:text-sm text-[#AAB8CE] leading-relaxed">
                {project.goals || 'Scale targeted high-intent conversion volume while strictly controlling customer acquisition costs.'}
              </p>
            </div>
          </div>

          {/* Strategy */}
          {project.strategy && (
            <div className="p-5 rounded-xl bg-[#1A2438]/40 border border-[#232E45]">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                Growth Strategy & Approach
              </span>
              <p className="text-xs sm:text-sm text-[#F2F5FA] leading-relaxed">
                {project.strategy}
              </p>
            </div>
          )}

          {/* Work Completed */}
          {project.workCompleted && project.workCompleted.length > 0 && (
            <div className="p-5 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C6DC] block mb-3">
                Execution & Scope Completed
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.workCompleted.map((task, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F2F5FA]">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Campaign Visuals & Proof of Work Gallery */}
          {allImages.length > 1 && (
            <div className="p-5 rounded-xl bg-[#1A2438]/40 border border-[#232E45]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-cyan-400" />
                  Campaign Visuals & Proof of Performance ({allImages.length} images)
                </span>
                <span className="text-[11px] text-[#AAB8CE]">
                  Click any image to enlarge
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border cursor-pointer group transition-all ${
                      activeImageIndex === idx
                        ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-[1.02]'
                        : 'border-[#232E45] hover:border-cyan-500/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Visual ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-[#0A0E1A]/80 text-[10px] text-cyan-300 font-medium">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools Used */}
          {project.toolsUsed && project.toolsUsed.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#AAB8CE] block mb-2.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#B8C6DC]" />
                Marketing Stack & Tools Deployed
              </span>
              <div className="flex flex-wrap gap-2">
                {project.toolsUsed.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-[#1A2438] border border-[#3A4A63] text-xs font-medium text-[#B8C6DC]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#232E45] flex items-center justify-between bg-[#0A0E1A]">
          <span className="text-xs text-[#AAB8CE]">
            Confidential Client Case Study • Verified Digital Marketing Metrics
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A2438] hover:bg-[#232E45] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
