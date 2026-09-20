import React, { useState, useMemo } from 'react';
import { Briefcase, PlusCircle, Filter, RotateCcw, Sparkles } from 'lucide-react';
import { Project } from '../types.ts';
import { ProjectCard } from './ProjectCard.tsx';

interface PortfolioProps {
  projects: Project[];
  isAdmin: boolean;
  onSaveProject: (data: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string, title: string) => Promise<void>;
  onResetProjects: () => Promise<void>;
  onRequestAdmin: () => void;
  onOpenAddProject: () => void;
  onEditProject: (project: Project) => void;
  onViewCaseStudy: (project: Project) => void;
}

const FILTER_CATEGORIES = [
  'All',
  'Meta Ads',
  'Google Ads',
  'Local SEO',
  'Google Analytics',
  'SEO',
  'Social Media Management',
  'Pixel Setup and Tracking',
  'Google Map Citation',
];

export const Portfolio: React.FC<PortfolioProps> = ({
  projects,
  isAdmin,
  onSaveProject,
  onDeleteProject,
  onResetProjects,
  onRequestAdmin,
  onOpenAddProject,
  onEditProject,
  onViewCaseStudy,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    if (activeCategory === 'SEO') {
      return projects.filter(
        (p) =>
          p.category.toLowerCase().includes('seo') ||
          p.category === 'On-Page SEO' ||
          p.category === 'Off-Page SEO' ||
          p.category === 'Local SEO'
      );
    }
    return projects.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [projects, activeCategory]);

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onRequestAdmin();
      return;
    }
    onOpenAddProject();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await onDeleteProject(id, title);
    }
  };

  return (
    <section id="portfolio" className="py-24 relative z-10 border-t border-[#232E45]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2438] border border-[#232E45] text-xs font-semibold text-[#B8C6DC] uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Case Studies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F5FA] tracking-tight">
              Featured Client Projects & Results
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#AAB8CE] max-w-xl">
              Measurable outcomes across paid acquisition, technical search engine optimization, and enterprise analytics tracking.
            </p>
          </div>

          {/* Action buttons (only visible when logged in as admin) */}
          {isAdmin && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onResetProjects}
                title="Restore default curated sample projects"
                className="px-3.5 py-2 rounded-xl bg-[#1A2438] hover:bg-[#232E45] text-[#AAB8CE] hover:text-white border border-[#232E45] text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
                id="portfolio-add-project-btn"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <div className="flex items-center gap-1.5 p-1 bg-[#1A2438]/60 backdrop-blur-md rounded-2xl border border-[#232E45]">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3A4A63] text-white shadow-sm'
                      : 'text-[#AAB8CE] hover:text-[#F2F5FA] hover:bg-[#232E45]/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#1A2438]/30 border border-[#232E45]">
            <p className="text-[#AAB8CE] text-sm">
              No projects found in the "{activeCategory}" category.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-3 text-xs text-cyan-400 hover:underline font-semibold"
            >
              View all projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onViewCaseStudy={(p) => onViewCaseStudy(p)}
                onEdit={(p) => onEditProject(p)}
                onDelete={(id, title) => handleDelete(id, title)}
                onRequestAdmin={onRequestAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
