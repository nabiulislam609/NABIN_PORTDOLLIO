import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Calendar, CheckCircle2, TrendingUp, Target, Wrench, Briefcase } from 'lucide-react';
import { Project } from '../types.ts';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  onClose,
}) => {
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
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#0A0E1A]/80 backdrop-blur-md text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] border border-[#232E45] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image & Header */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden bg-[#1A2438]">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/50 to-transparent" />

          {/* Overlaid Title & Category */}
          <div className="absolute bottom-6 left-6 right-6">
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

            <h2 id="case-study-title" className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

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
            className="px-5 py-2 rounded-xl bg-[#1A2438] hover:bg-[#232E45] text-xs font-semibold text-white transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
