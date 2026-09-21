import React from 'react';
import { ExternalLink, Eye, Edit3, Trash2, TrendingUp, Calendar, Tag, Images } from 'lucide-react';
import { Project } from '../types.ts';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onViewCaseStudy: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string, title: string) => void;
  onRequestAdmin: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isAdmin,
  onViewCaseStudy,
  onEdit,
  onDelete,
  onRequestAdmin,
}) => {
  return (
    <div
      className="group rounded-2xl bg-[#1A2438]/60 border border-[#232E45] hover:border-[#3A4A63] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
      id={`project-card-${project.id}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0E1A]">
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-[#0A0E1A]/80 backdrop-blur-md border border-[#232E45] text-[11px] font-semibold text-cyan-300">
            {project.category}
          </span>
          {project.date && (
            <span className="px-2 py-0.5 rounded-md bg-[#0A0E1A]/80 backdrop-blur-md text-[10px] text-[#AAB8CE] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.date}
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onViewCaseStudy(project)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#3A4A63]/80 backdrop-blur-md border border-[#B8C6DC]/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl"
          title="Inspect Case Study"
          aria-label={`Inspect Case Study for ${project.title}`}
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Gallery Count Badge if multiple images exist */}
        {project.images && project.images.length > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-[#0A0E1A]/85 backdrop-blur-md border border-[#232E45] text-[10px] font-semibold text-cyan-300 flex items-center gap-1 shadow-md">
            <Images className="w-3 h-3 text-cyan-400" />
            <span>{project.images.length + (project.image ? 1 : 0)} Visuals</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {project.clientIndustry && (
            <span className="text-[11px] font-medium text-[#AAB8CE] uppercase tracking-wider block mb-1">
              {project.clientIndustry}
            </span>
          )}

          <h3 className="text-lg font-bold text-[#F2F5FA] mb-2 group-hover:text-white transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#AAB8CE] leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Results Badge */}
          <div className="p-2.5 rounded-xl bg-[#232E45]/40 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="line-clamp-1">{project.results}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#232E45]/80 flex items-center justify-between gap-2">
          {/* View Project Button */}
          <button
            onClick={() => onViewCaseStudy(project)}
            className="px-3.5 py-1.5 rounded-lg bg-[#232E45] hover:bg-[#3A4A63] text-xs font-semibold text-[#F2F5FA] flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-300" />
            <span>View Project</span>
          </button>

          {/* Edit / Delete Buttons (only visible to logged in admin) */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(project)}
                title="Edit Project"
                className="p-1.5 rounded-lg text-[#AAB8CE] hover:text-white hover:bg-[#232E45] transition-colors"
                aria-label={`Edit ${project.title}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onDelete(project.id, project.title)}
                title="Delete Project"
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                aria-label={`Delete ${project.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
