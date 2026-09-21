import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  PlusCircle,
  Settings,
  Mail,
  Database,
  LogOut,
  ExternalLink,
  Trash2,
  Edit3,
  TrendingUp,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Globe,
  RefreshCw,
  Search,
  MessageSquare,
  Images,
} from 'lucide-react';
import { Project, ProfileConfig, ContactMessage } from '../types.ts';
import { apiLogin } from '../services/apiService.ts';

interface AdminPortalPageProps {
  profile: ProfileConfig;
  projects: Project[];
  inquiries: ContactMessage[];
  isAdmin: boolean;
  adminToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenProfileSettings: () => void;
  onAddNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onOpenBackendDocs: () => void;
  onMarkInquiryRead?: (id: string) => void;
  onDeleteInquiry?: (id: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  profile,
  projects,
  inquiries,
  isAdmin,
  adminToken,
  onLoginSuccess,
  onLogout,
  onNavigateHome,
  onOpenProfileSettings,
  onAddNewProject,
  onEditProject,
  onDeleteProject,
  onOpenBackendDocs,
  onMarkInquiryRead,
  onDeleteInquiry,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'inquiries' | 'profile' | 'system'>('overview');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = inquiries.filter((m) => m.status === 'unread').length;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await apiLogin(password);
      if (res.token) {
        onLoginSuccess(res.token);
      } else {
        setLoginError('Invalid administrator credentials.');
      }
    } catch {
      setLoginError('Connection failure or invalid password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const filteredInquiries = inquiries.filter((m) => {
    if (inquiryFilter === 'unread') {
      return m.status === 'unread';
    }
    return true;
  });

  // If not authenticated, show standalone secure login screen
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#070A12] text-[#F2F5FA] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back to website button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131B2E]/90 hover:bg-[#1C2844] border border-[#232E45] text-xs font-semibold text-[#AAB8CE] hover:text-white transition-all shadow-sm cursor-pointer"
            id="back-to-website-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Live Portfolio</span>
          </button>
        </div>

        {/* Portal card */}
        <div className="relative z-10 w-full max-w-md bg-[#0D1424] border border-[#23314D] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1A2438] border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  /admin
                </span>
              </div>
              <p className="text-xs text-[#AAB8CE] mt-0.5">
                {profile.name} CMS & Content Management
              </p>
            </div>
          </div>

          <p className="text-xs text-[#AAB8CE] mb-6 leading-relaxed">
            Please enter your administrator password to manage case studies, update profile information, and review client inquiries.
          </p>

          {loginError && (
            <div className="p-3 mb-5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8C6DC] mb-2">
                Master Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  autoFocus
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#151F36] border border-[#232E45] focus:border-cyan-400 text-sm text-[#F2F5FA] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB8CE] hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                id="admin-portal-login-submit"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#232E45] flex items-center justify-between text-xs text-[#AAB8CE]">
            <span>Secured Session Engine</span>
            <button
              onClick={onNavigateHome}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              ← Return to website
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated full-screen dashboard
  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FA] flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-[#0D1424]/95 backdrop-blur-md border-b border-[#23314D] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] text-xs font-semibold text-[#AAB8CE] hover:text-white transition-colors cursor-pointer"
            title="Return to the live public portfolio"
            id="portal-header-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Live Website</span>
          </button>

          <div className="h-5 w-px bg-[#232E45]" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">{profile.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  Admin Active
                </span>
              </div>
              <span className="text-[11px] text-[#AAB8CE] block">CMS & Portfolio Dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenProfileSettings}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] text-xs font-semibold text-[#F2F5FA] transition-colors cursor-pointer"
            id="portal-profile-settings-btn"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={onAddNewProject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            id="portal-add-project-btn"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            title="Log out of admin mode"
            id="portal-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#232E45]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#131B2E]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#131B2E]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#131B2E]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquiries</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-500 text-black font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#131B2E]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Profile & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'system'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'text-[#AAB8CE] hover:text-white hover:bg-[#131B2E]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database & System</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#23314D] shadow-md">
                <div className="flex items-center justify-between text-[#AAB8CE] mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Projects</span>
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">{projects.length}</div>
                <div className="text-[11px] text-[#AAB8CE] mt-1">Live portfolio case studies</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#23314D] shadow-md">
                <div className="flex items-center justify-between text-[#AAB8CE] mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Unread Inquiries</span>
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>{unreadCount}</span>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                      Needs review
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#AAB8CE] mt-1">Total received: {inquiries.length}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#23314D] shadow-md">
                <div className="flex items-center justify-between text-[#AAB8CE] mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Backend Storage</span>
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Synchronized</span>
                </div>
                <div className="text-[11px] text-[#AAB8CE] mt-1">JSON filesystem persistence active</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#23314D] shadow-md">
                <div className="flex items-center justify-between text-[#AAB8CE] mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Portal Access</span>
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white font-mono text-base pt-1">
                  website.com/admin
                </div>
                <div className="text-[11px] text-[#AAB8CE] mt-1">Private URL enabled</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#23314D]">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>Quick Administration Actions</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={onAddNewProject}
                  className="p-4 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] hover:border-emerald-400/40 text-left transition-all group cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-white">Add New Case Study</div>
                  <div className="text-xs text-[#AAB8CE] mt-1">Publish campaign metrics and deliverables</div>
                </button>

                <button
                  onClick={onOpenProfileSettings}
                  className="p-4 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] hover:border-cyan-400/40 text-left transition-all group cursor-pointer"
                >
                  <Settings className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-white">Edit Profile & Bio</div>
                  <div className="text-xs text-[#AAB8CE] mt-1">Update headline, hero image, social links</div>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="p-4 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] hover:border-amber-400/40 text-left transition-all group cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-white">Check Inquiries</div>
                  <div className="text-xs text-[#AAB8CE] mt-1">{unreadCount} unread client messages</div>
                </button>

                <button
                  onClick={onOpenBackendDocs}
                  className="p-4 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] hover:border-purple-400/40 text-left transition-all group cursor-pointer"
                >
                  <Database className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-white">Database & API Specs</div>
                  <div className="text-xs text-[#AAB8CE] mt-1">View backend schemas and data structures</div>
                </button>
              </div>
            </div>

            {/* Recent Inquiries Preview */}
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#23314D]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Recent Inquiries</span>
                </h2>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  View all ({inquiries.length}) →
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#AAB8CE] bg-[#151F36]/50 rounded-xl border border-[#232E45]">
                  No inquiries received yet. When visitors fill the Contact form, their leads will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl bg-[#151F36] border border-[#232E45] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{inq.name}</span>
                          <span className="text-xs text-[#AAB8CE]">({inq.email})</span>
                          {inq.status === 'unread' && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-black font-bold rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#D0DBEA] mt-1 line-clamp-1">{inq.message}</p>
                      </div>
                      <span className="text-[11px] text-[#AAB8CE] shrink-0 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Portfolio Projects</h2>
                <p className="text-xs text-[#AAB8CE] mt-0.5">
                  Add, edit, reorder or delete published case studies.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#AAB8CE] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-[#151F36] border border-[#232E45] text-xs text-white focus:outline-none focus:border-cyan-400 w-44 sm:w-60"
                  />
                </div>

                <button
                  onClick={onAddNewProject}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow transition-all cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0D1424] border border-[#23314D] rounded-2xl overflow-hidden flex flex-col shadow-lg transition-all hover:border-cyan-500/40"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-[#151F36] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A0E1A]/85 backdrop-blur-md border border-[#232E45] text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      {project.category}
                    </div>
                    {project.images && project.images.length > 0 && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#0A0E1A]/90 backdrop-blur-md border border-[#232E45] text-[10px] font-semibold text-cyan-300 flex items-center gap-1 shadow">
                        <Images className="w-3 h-3 text-cyan-400" />
                        <span>{project.images.length + (project.image ? 1 : 0)} photos</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1.5">{project.title}</h3>
                      <p className="text-xs text-[#AAB8CE] line-clamp-2 mb-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Metrics badge */}
                      {project.results && (
                        <div className="p-2.5 rounded-xl bg-[#151F36] border border-[#232E45] text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-3">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{project.results}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#232E45] flex items-center justify-between">
                      {project.projectUrl ? (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#AAB8CE] hover:text-white flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Preview</span>
                        </a>
                      ) : (
                        <span className="text-xs text-[#AAB8CE]/50">No external link</span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditProject(project)}
                          className="p-1.5 rounded-lg bg-[#151F36] hover:bg-cyan-950/60 hover:text-cyan-300 text-[#AAB8CE] border border-[#232E45] transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                              onDeleteProject(project.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#151F36] hover:bg-rose-950/60 hover:text-rose-300 text-[#AAB8CE] border border-[#232E45] transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: INQUIRIES ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Client Inquiries & Leads</h2>
                <p className="text-xs text-[#AAB8CE] mt-0.5">
                  Submissions received through the contact form.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInquiryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    inquiryFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-[#AAB8CE] bg-[#151F36]'
                  }`}
                >
                  All ({inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('unread')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    inquiryFilter === 'unread'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-[#AAB8CE] bg-[#151F36]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#AAB8CE] bg-[#0D1424] rounded-2xl border border-[#23314D]">
                No inquiries found in this category.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-[#0D1424] border border-[#23314D] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{inq.name}</span>
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          {inq.email}
                        </a>
                        {inq.subject && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#151F36] border border-[#232E45] text-[#AAB8CE] rounded-full">
                            {inq.subject}
                          </span>
                        )}
                        {inq.status === 'unread' && (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-black font-bold rounded-full">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#D6E0F0] leading-relaxed bg-[#151F36]/60 p-3 rounded-xl border border-[#232E45]">
                        {inq.message}
                      </p>
                      <div className="text-[11px] text-[#AAB8CE] font-mono">
                        Received: {new Date(inq.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`mailto:${inq.email}?subject=Re: Digital Marketing Consultation`}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Reply</span>
                      </a>

                      {onMarkInquiryRead && inq.status === 'unread' && (
                        <button
                          onClick={() => onMarkInquiryRead(inq.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#151F36] hover:bg-[#1C2844] text-[#AAB8CE] hover:text-white border border-[#232E45] text-xs font-medium transition-colors cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}

                      {onDeleteInquiry && (
                        <button
                          onClick={() => onDeleteInquiry(inq.id)}
                          className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: PROFILE & BIO ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Profile Configuration</h2>
                <p className="text-xs text-[#AAB8CE] mt-0.5">
                  Update your name, headline, contact numbers, and master password.
                </p>
              </div>

              <button
                onClick={onOpenProfileSettings}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Open Full Profile Editor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#23314D] space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                  Current Identity & Bio
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#AAB8CE] block">Full Name:</span>
                    <span className="font-semibold text-white text-sm">{profile.name}</span>
                  </div>

                  <div>
                    <span className="text-[#AAB8CE] block">Professional Title:</span>
                    <span className="font-semibold text-white">{profile.title}</span>
                  </div>

                  <div>
                    <span className="text-[#AAB8CE] block">Email:</span>
                    <span className="font-semibold text-white">{profile.email}</span>
                  </div>

                  <div>
                    <span className="text-[#AAB8CE] block">WhatsApp / Phone:</span>
                    <span className="font-semibold text-white">{profile.whatsapp}</span>
                  </div>

                  <div>
                    <span className="text-[#AAB8CE] block">Location:</span>
                    <span className="font-semibold text-white">{profile.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#23314D] space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
                  Security & Access
                </h3>
                <p className="text-xs text-[#AAB8CE] leading-relaxed">
                  The admin portal URL is accessible at <code className="text-cyan-300 font-mono bg-[#151F36] px-1.5 py-0.5 rounded">website.com/admin</code>. You can update your master password directly inside the Profile Settings modal.
                </p>

                <div className="pt-2">
                  <button
                    onClick={onOpenProfileSettings}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Change Master Admin Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SYSTEM & DATABASE ================= */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">System Architecture & Database</h2>
                <p className="text-xs text-[#AAB8CE] mt-0.5">
                  Live backend state, JSON persistence storage, and API endpoints.
                </p>
              </div>

              <button
                onClick={onOpenBackendDocs}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151F36] hover:bg-[#1C2844] border border-[#232E45] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Full API Specs</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#23314D] space-y-4">
              <h3 className="text-sm font-bold text-white">Available Server API Endpoints</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#151F36] border border-[#232E45]">
                  <span className="text-emerald-400 font-bold">GET</span> /api/projects
                  <div className="text-[11px] text-[#AAB8CE] font-sans mt-1">Fetch all portfolio case studies</div>
                </div>

                <div className="p-3 rounded-xl bg-[#151F36] border border-[#232E45]">
                  <span className="text-cyan-400 font-bold">POST</span> /api/projects
                  <div className="text-[11px] text-[#AAB8CE] font-sans mt-1">Create a new project (Admin auth)</div>
                </div>

                <div className="p-3 rounded-xl bg-[#151F36] border border-[#232E45]">
                  <span className="text-amber-400 font-bold">PUT</span> /api/projects/:id
                  <div className="text-[11px] text-[#AAB8CE] font-sans mt-1">Update existing project</div>
                </div>

                <div className="p-3 rounded-xl bg-[#151F36] border border-[#232E45]">
                  <span className="text-rose-400 font-bold">DELETE</span> /api/projects/:id
                  <div className="text-[11px] text-[#AAB8CE] font-sans mt-1">Delete project from database</div>
                </div>

                <div className="p-3 rounded-xl bg-[#151F36] border border-[#232E45]">
                  <span className="text-emerald-400 font-bold">GET</span> /api/profile
                  <div className="text-[11px] text-[#AAB8CE] font-sans mt-1">Fetch current profile & bio config</div>
                </div>

                <div className="p-3 rounded-xl bg-[#151F36] border border-[#232E45]">
                  <span className="text-amber-400 font-bold">PUT</span> /api/profile
                  <div className="text-[11px] text-[#AAB8CE] font-sans mt-1">Update bio, name, & settings</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
