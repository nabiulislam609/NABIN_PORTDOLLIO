import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Save, AlertCircle } from 'lucide-react';
import { Project } from '../types.ts';

interface ProjectFormModalProps {
  isOpen: boolean;
  projectToEdit: Project | null;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => Promise<void>;
}

const CATEGORIES = [
  'Meta Ads',
  'Google Ads',
  'Local SEO',
  'Google Map Citation',
  'Facebook Page Optimization',
  'Social Media Management',
  'Pixel Setup and Tracking',
  'Google Analytics',
  'Google Tag Manager',
  'On-Page SEO',
  'Off-Page SEO',
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  projectToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [workCompletedText, setWorkCompletedText] = useState('');
  const [results, setResults] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [date, setDate] = useState(new Date().getFullYear().toString());
  const [clientIndustry, setClientIndustry] = useState('');
  const [strategy, setStrategy] = useState('');
  const [toolsUsedText, setToolsUsedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '');
      setCategory(projectToEdit.category || CATEGORIES[0]);
      setImage(projectToEdit.image || '');
      setDescription(projectToEdit.description || '');
      setGoals(projectToEdit.goals || '');
      setWorkCompletedText(
        Array.isArray(projectToEdit.workCompleted)
          ? projectToEdit.workCompleted.join('\n')
          : ''
      );
      setResults(projectToEdit.results || '');
      setProjectUrl(projectToEdit.projectUrl || '');
      setDate(projectToEdit.date || new Date().getFullYear().toString());
      setClientIndustry(projectToEdit.clientIndustry || '');
      setStrategy(projectToEdit.strategy || '');
      setToolsUsedText(
        Array.isArray(projectToEdit.toolsUsed)
          ? projectToEdit.toolsUsed.join(', ')
          : ''
      );
    } else {
      // Reset form
      setTitle('');
      setCategory(CATEGORIES[0]);
      setImage(
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop'
      );
      setDescription('');
      setGoals('');
      setWorkCompletedText('');
      setResults('');
      setProjectUrl('');
      setDate(new Date().getFullYear().toString());
      setClientIndustry('');
      setStrategy('');
      setToolsUsedText('');
    }
    setError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('Image file size must be less than 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Project Description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const workCompleted = workCompletedText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const toolsUsed = toolsUsedText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        title: title.trim(),
        category,
        image: image.trim(),
        description: description.trim(),
        goals: goals.trim(),
        workCompleted,
        results: results.trim() || '+150% Performance Boost',
        projectUrl: projectUrl.trim(),
        date: date.trim(),
        clientIndustry: clientIndustry.trim(),
        strategy: strategy.trim(),
        toolsUsed,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F2F5FA]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Portfolio Management System
          </span>
          <h2 id="project-form-modal-title" className="text-2xl font-bold text-white mt-1">
            {projectToEdit ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
          </h2>
          <p className="text-xs sm:text-sm text-[#AAB8CE] mt-1">
            Fill in the campaign details. Changes will be securely saved to the persistent database.
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. E-Commerce Scaling Campaign"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Image URL & Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
              Project Image (URL or Upload)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
              <label className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-[#232E45] hover:bg-[#3A4A63] text-xs font-semibold text-[#F2F5FA] border border-[#3A4A63] cursor-pointer flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {image && (
              <div className="mt-2.5 relative aspect-[16/6] w-full rounded-xl overflow-hidden bg-[#1A2438] border border-[#232E45]">
                <img
                  src={image}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
              Project Description *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of the campaign, client, and problem addressed..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
            />
          </div>

          {/* Row 4: Results & Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Key Results / Achievements *
              </label>
              <input
                type="text"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="+340% ROAS, -28% CPA, Top 3 Map Pack"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Campaign Goals & Objectives
              </label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Specific revenue or ranking goals..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Industry, Date, Project URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Client Industry
              </label>
              <input
                type="text"
                value={clientIndustry}
                onChange={(e) => setClientIndustry(e.target.value)}
                placeholder="e.g. Healthcare, B2B SaaS"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Date or Year
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2025"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Project Link (Optional)
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://client-site.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 6: Work Completed (Multiline) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
              Work Completed (1 task per line)
            </label>
            <textarea
              rows={3}
              value={workCompletedText}
              onChange={(e) => setWorkCompletedText(e.target.value)}
              placeholder="Built 3-tier campaign funnel&#10;Tested 20+ ad copy variations&#10;Configured GA4 and CAPI deduplication"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
            />
          </div>

          {/* Row 7: Strategy & Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Strategy Used
              </label>
              <input
                type="text"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Audience segmentation & value-based bidding"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-1.5">
                Tools Used (comma separated)
              </label>
              <input
                type="text"
                value={toolsUsedText}
                onChange={(e) => setToolsUsedText(e.target.value)}
                placeholder="Meta Ads Manager, GTM, GA4, SurferSEO"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A2438] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#232E45] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#AAB8CE] hover:text-white bg-[#1A2438] hover:bg-[#232E45] transition-colors"
            >
              Cancel Editing
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
