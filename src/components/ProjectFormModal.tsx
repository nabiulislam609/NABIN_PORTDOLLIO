import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Upload,
  Image as ImageIcon,
  Save,
  AlertCircle,
  Trash2,
  Plus,
  Star,
  Images,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Project } from '../types.ts';
import { processImageFile } from '../utils/imageUtils.ts';

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
  const [images, setImages] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');
  const [showThumbnailUrlInput, setShowThumbnailUrlInput] = useState(false);
  const [showGalleryUrlInput, setShowGalleryUrlInput] = useState(false);
  const [isProcessingThumbnail, setIsProcessingThumbnail] = useState(false);
  const [isProcessingGallery, setIsProcessingGallery] = useState(false);
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
      setImages(Array.isArray(projectToEdit.images) ? projectToEdit.images.filter(Boolean) : []);
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
      setImages([]);
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
    setGalleryUrlInput('');
    setThumbnailUrlInput('');
    setShowThumbnailUrlInput(false);
    setShowGalleryUrlInput(false);
  }, [projectToEdit, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle local thumbnail upload from desktop
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingThumbnail(true);
        setError(null);
        const dataUrl = await processImageFile(file, 1600, 0.85);
        setImage(dataUrl);
      } catch (err: any) {
        setError(err?.message || 'Failed to process thumbnail file');
      } finally {
        setIsProcessingThumbnail(false);
        e.target.value = '';
      }
    }
  };

  // Handle multiple project gallery images upload from desktop
  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setIsProcessingGallery(true);
        setError(null);
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            const dataUrl = await processImageFile(file, 1600, 0.85);
            newImages.push(dataUrl);
          }
        }
        setImages((prev) => [...prev, ...newImages]);
        // If there's no thumbnail currently set, make the first uploaded image the thumbnail
        if (!image && newImages.length > 0) {
          setImage(newImages[0]);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to process gallery images');
      } finally {
        setIsProcessingGallery(false);
        e.target.value = '';
      }
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    const url = galleryUrlInput.trim();
    setImages((prev) => [...prev, url]);
    if (!image) {
      setImage(url);
    }
    setGalleryUrlInput('');
  };

  const handleApplyThumbnailUrl = () => {
    if (!thumbnailUrlInput.trim()) return;
    setImage(thumbnailUrlInput.trim());
    setThumbnailUrlInput('');
    setShowThumbnailUrlInput(false);
  };

  const handleSetThumbnail = (selectedUrl: string) => {
    setImage(selectedUrl);
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
        image: image.trim() || (images.length > 0 ? images[0] : ''),
        images: images.filter(Boolean),
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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
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

          {/* Row 2: Project Thumbnail & Multiple Images */}
          <div className="space-y-4">
            {/* SECTION 1: PROJECT THUMBNAIL (COVER IMAGE) */}
            <div className="p-4 rounded-2xl border border-cyan-500/30 bg-[#0E1526] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-white">
                      Project Thumbnail
                    </label>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-semibold text-cyan-300">
                      Card Cover Image
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AAB8CE] mt-0.5">
                    This thumbnail is displayed on portfolio project cards and case study covers.
                  </p>
                </div>

                {/* Direct Thumbnail Upload / Add Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 transition-all shadow-md">
                    {isProcessingThumbnail ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{image ? 'Change Thumbnail' : 'Add Thumbnail'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isProcessingThumbnail}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowThumbnailUrlInput(!showThumbnailUrlInput)}
                    className="px-3 py-2 rounded-xl bg-[#1A2438] hover:bg-[#22304A] border border-[#232E45] text-xs font-medium text-[#B8C6DC] flex items-center gap-1.5 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showThumbnailUrlInput ? 'Hide URL' : 'Paste URL'}</span>
                  </button>

                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:text-rose-100 hover:bg-rose-900/50 transition-colors"
                      title="Remove thumbnail"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Thumbnail URL Input Box */}
              {showThumbnailUrlInput && (
                <div className="flex items-center gap-2 mb-3 animate-fade-in">
                  <input
                    type="text"
                    value={thumbnailUrlInput}
                    onChange={(e) => setThumbnailUrlInput(e.target.value)}
                    placeholder="Paste direct image URL (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#151F36] border border-[#232E45] focus:border-cyan-400 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyThumbnailUrl}
                    disabled={!thumbnailUrlInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
                  >
                    Set as Thumbnail
                  </button>
                </div>
              )}

              {/* Thumbnail Live Preview */}
              {image ? (
                <div className="relative aspect-[16/7] w-full rounded-xl overflow-hidden bg-[#151F36] border border-[#232E45] shadow-inner group">
                  <img
                    src={image}
                    alt="Active Thumbnail Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#0A0E1A]/85 backdrop-blur-md border border-cyan-500/40 text-[10px] font-bold text-cyan-300 flex items-center gap-1.5 shadow-md">
                    <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                    <span>Active Card Thumbnail</span>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#23314D] hover:border-cyan-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#121826]/60 hover:bg-[#151F36]/80 transition-all text-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Click here to Add Project Thumbnail
                    </span>
                    <span className="text-[11px] text-[#AAB8CE]">
                      Upload JPG, PNG or WebP from your computer
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* SECTION 2: MULTIPLE PROJECT IMAGES (GALLERY & SCREENSHOTS) */}
            <div className="p-4 rounded-2xl border border-[#232E45] bg-[#0E1526]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-emerald-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-white">
                      Multiple Project Images
                    </label>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300">
                      {images.length} {images.length === 1 ? 'image' : 'images'} added
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AAB8CE] mt-0.5">
                    Upload campaign screenshots, analytics results, or ad creatives to showcase in the case study gallery.
                  </p>
                </div>

                {/* Multiple Images Upload & Add Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 transition-all shadow-md">
                    {isProcessingGallery ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Add Multiple Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleGalleryUpload}
                      disabled={isProcessingGallery}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowGalleryUrlInput(!showGalleryUrlInput)}
                    className="px-3 py-2 rounded-xl bg-[#1A2438] hover:bg-[#22304A] border border-[#232E45] text-xs font-medium text-[#B8C6DC] flex items-center gap-1.5 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{showGalleryUrlInput ? 'Hide URL' : 'Add by URL'}</span>
                  </button>

                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="px-2.5 py-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:text-rose-100 hover:bg-rose-900/50 text-xs transition-colors"
                      title="Clear all gallery images"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Add Image by URL Row */}
              {showGalleryUrlInput && (
                <div className="flex items-center gap-2 mb-3 animate-fade-in">
                  <input
                    type="text"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    placeholder="Paste image URL to add to gallery (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#151F36] border border-[#232E45] focus:border-emerald-400 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    disabled={!galleryUrlInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
                  >
                    + Add to Gallery
                  </button>
                </div>
              )}

              {/* Gallery Grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {images.map((imgUrl, index) => {
                    const isCurrentThumbnail = image === imgUrl;
                    return (
                      <div
                        key={index}
                        className={`relative rounded-xl overflow-hidden border aspect-[4/3] group bg-[#151F36] shadow-sm transition-all ${
                          isCurrentThumbnail
                            ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                            : 'border-[#232E45] hover:border-cyan-500/50'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Project visual ${index + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />

                        {/* Top Indicator Badge */}
                        <div className="absolute top-1.5 left-1.5">
                          {isCurrentThumbnail ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-400 text-[9px] font-bold text-cyan-300 flex items-center gap-1 shadow">
                              <Star className="w-2.5 h-2.5 fill-cyan-300" />
                              Thumbnail
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#0A0E1A]/80 text-[9px] text-[#AAB8CE]">
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Bottom Actions Toolbar */}
                        <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/80 to-transparent flex items-center justify-between gap-1">
                          {!isCurrentThumbnail ? (
                            <button
                              type="button"
                              onClick={() => handleSetThumbnail(imgUrl)}
                              className="px-2 py-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[10px] font-semibold text-cyan-300 flex items-center gap-1 transition-all"
                              title="Set this image as project thumbnail"
                            >
                              <Star className="w-2.5 h-2.5" />
                              <span>Make Thumbnail</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold text-cyan-300 px-1">
                              Current Cover
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="p-1 rounded-md bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 hover:text-white transition-colors ml-auto"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-dashed border-[#232E45] rounded-xl p-4 text-center bg-[#121826]/40">
                  <p className="text-xs text-[#AAB8CE]">
                    No additional images added yet. Click{' '}
                    <span className="text-emerald-400 font-semibold">+ Add Multiple Images</span> to
                    upload proof of work or screenshots.
                  </p>
                </div>
              )}
            </div>
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
    </div>,
    document.body
  );
};
