import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBubbles } from './components/FloatingBubbles.tsx';
import { MouseGlow } from './components/MouseGlow.tsx';
import { MouseBubble } from './components/MouseBubble.tsx';
import { WaterRipples } from './components/WaterRipples.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Services } from './components/Services.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminBar } from './components/AdminBar.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminPortalPage } from './components/AdminPortalPage.tsx';
import { ProfileEditModal } from './components/ProfileEditModal.tsx';
import { InquiriesModal } from './components/InquiriesModal.tsx';
import { BackendDocsModal } from './components/BackendDocsModal.tsx';
import { ProjectFormModal } from './components/ProjectFormModal.tsx';
import { ProjectCaseStudyModal } from './components/ProjectCaseStudyModal.tsx';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from './data/defaultData.ts';
import { ProfileConfig, Project, ContactMessage } from './types.ts';
import { scrollToElement } from './utils/scroll.ts';
import {
  apiGetProfile,
  apiSaveProfile,
  apiGetProjects,
  apiSaveProject,
  apiDeleteProject,
  apiResetProjects,
  apiGetInquiries,
  apiDeleteInquiry,
  apiMarkInquiryRead,
  apiVerifyToken,
  apiChangePassword,
} from './services/apiService.ts';

const checkIsAdminPath = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash.startsWith('#/admin');
};

export default function App() {
  const [profile, setProfile] = useState<ProfileConfig>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminPath);

  // Modals
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isBackendDocsOpen, setIsBackendDocsOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Initial Data Fetching
  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiGetProfile();
      setProfile(data);
    } catch (e) {
      console.warn('Using local default profile:', e);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await apiGetProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    } catch (e) {
      console.warn('Using local default projects:', e);
    }
  }, []);

  const fetchInquiries = useCallback(async (token: string) => {
    try {
      const data = await apiGetInquiries(token);
      setInquiries(data);
    } catch (e) {
      console.error('Error fetching inquiries:', e);
    }
  }, []);

  // Check saved admin token on boot & set up secret admin shortcuts
  useEffect(() => {
    fetchProfile();
    fetchProjects();

    const savedToken = localStorage.getItem('portfolio_admin_token');
    if (savedToken) {
      apiVerifyToken(savedToken).then((authenticated) => {
        if (authenticated) {
          setIsAdmin(true);
          setAdminToken(savedToken);
          fetchInquiries(savedToken);
        } else {
          localStorage.removeItem('portfolio_admin_token');
        }
      });
    }

    // Check if opened with #admin or /admin
    const handleLocationChange = () => {
      const isAdm = checkIsAdminPath();
      setIsAdminRoute(isAdm);
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Keyboard shortcut for owner: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (checkIsAdminPath()) {
          window.history.pushState({}, '', '/');
          setIsAdminRoute(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.history.pushState({}, '', '/admin');
          setIsAdminRoute(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchProfile, fetchProjects, fetchInquiries]);

  // Routing Helpers
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (token: string) => {
    setIsAdmin(true);
    setAdminToken(token);
    fetchInquiries(token);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminToken(null);
    localStorage.removeItem('portfolio_admin_token');
  };

  // Project CRUD Handlers
  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (!adminToken) {
      navigateToAdmin();
      return;
    }

    const updated = await apiSaveProject(adminToken, projectData);
    setProjects(updated);
  };

  const handleDeleteProject = async (id: string) => {
    if (!adminToken) {
      navigateToAdmin();
      return;
    }

    const updated = await apiDeleteProject(adminToken, id);
    setProjects(updated);
  };

  const handleResetProjects = async () => {
    if (!adminToken) return;
    if (confirm('Reset portfolio to original default curated case studies?')) {
      const resetList = await apiResetProjects(adminToken);
      setProjects(resetList);
    }
  };

  // Profile Update Handler
  const handleSaveProfile = async (updatedProfile: ProfileConfig) => {
    if (!adminToken) {
      navigateToAdmin();
      return;
    }

    const saved = await apiSaveProfile(adminToken, updatedProfile);
    setProfile(saved);
  };

  // Password Change Handler
  const handleChangePassword = async (newPassword: string) => {
    if (!adminToken) return;
    const res = await apiChangePassword(adminToken, newPassword);
    if (!res.success) {
      throw new Error(res.error || 'Failed to update password');
    }
  };

  // Inquiry Handlers
  const handleDeleteMessage = async (id: string) => {
    if (!adminToken) return;
    const updated = await apiDeleteInquiry(adminToken, id);
    setInquiries(updated);
  };

  const handleMarkInquiryRead = async (id: string) => {
    if (!adminToken) return;
    const updated = await apiMarkInquiryRead(adminToken, id);
    setInquiries(updated);
  };

  // Fast smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    scrollToElement(sectionId, 76, 380);
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setPrefilledSubject(serviceTitle);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F2F5FA] relative selection:bg-[#3A4A63] selection:text-white">
      {/* Background Ambience: Floating Bubbles, Dynamic Mouse Glow, Mouse Bubble Cursor & Water Ripples */}
      <FloatingBubbles />
      <MouseGlow />
      <MouseBubble />
      <WaterRipples />

      {/* Render Dedicated Admin Portal Page when URL is /admin, or render public portfolio */}
      {isAdminRoute ? (
        <AdminPortalPage
          profile={profile}
          projects={projects}
          inquiries={inquiries}
          isAdmin={isAdmin}
          adminToken={adminToken}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onNavigateHome={navigateToHome}
          onOpenProfileSettings={() => setIsProfileEditOpen(true)}
          onAddNewProject={() => {
            setEditingProject(null);
            setIsProjectFormOpen(true);
          }}
          onEditProject={(project) => {
            setEditingProject(project);
            setIsProjectFormOpen(true);
          }}
          onDeleteProject={handleDeleteProject}
          onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
          onMarkInquiryRead={handleMarkInquiryRead}
          onDeleteInquiry={handleDeleteMessage}
        />
      ) : (
        <>
          {/* Primary Sticky Navigation Bar (Clean public view without admin clutter) */}
          <Navbar profile={profile} />

          <main className="relative z-10">
            {/* Hero Section */}
            <Hero
              profile={profile}
              onExplorePortfolio={() => scrollToSection('portfolio')}
              onContactClick={() => scrollToSection('contact')}
            />

            {/* About Section */}
            <About
              profile={profile}
              onWorkTogetherClick={() => scrollToSection('contact')}
            />

            {/* Services Section */}
            <Services onSelectServiceForInquiry={handleSelectServiceForInquiry} />

            {/* Portfolio Section */}
            <Portfolio
              projects={projects}
              isAdmin={isAdmin}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onResetProjects={handleResetProjects}
              onRequestAdmin={navigateToAdmin}
              onOpenAddProject={() => {
                setEditingProject(null);
                setIsProjectFormOpen(true);
              }}
              onEditProject={(project) => {
                setEditingProject(project);
                setIsProjectFormOpen(true);
              }}
              onViewCaseStudy={(project) => {
                setSelectedCaseStudy(project);
              }}
            />

            {/* Contact Section */}
            <Contact
              profile={profile}
              prefilledSubject={prefilledSubject}
            />
          </main>

          {/* Footer with discreet link to /admin */}
          <Footer
            profile={profile}
            onOpenAdminLogin={navigateToAdmin}
            onNavigateToAdmin={navigateToAdmin}
            onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
          />

          {/* Admin Floating Control Bar (only visible when logged in and browsing public view) */}
          {isAdmin && (
            <AdminBar
              unreadInquiriesCount={inquiries.filter((m) => m.status === 'unread').length}
              onAddNewProject={() => {
                setEditingProject(null);
                setIsProjectFormOpen(true);
              }}
              onOpenProfileSettings={() => setIsProfileEditOpen(true)}
              onOpenInquiries={navigateToAdmin}
              onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
              onLogout={handleLogout}
            />
          )}
        </>
      )}

      {/* Admin Login / Hub Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onOpenProfileSettings={() => setIsProfileEditOpen(true)}
        onAddNewProject={() => {
          setEditingProject(null);
          setIsProjectFormOpen(true);
        }}
        onOpenInquiries={() => setIsInquiriesOpen(true)}
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
        unreadInquiriesCount={inquiries.filter((m) => m.status === 'unread').length}
      />

      {/* Site Profile & Personalization Modal */}
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        profile={profile}
        onClose={() => setIsProfileEditOpen(false)}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
      />

      {/* Project Creation & Editing Modal */}
      <ProjectFormModal
        isOpen={isProjectFormOpen}
        projectToEdit={editingProject}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        onSave={async (data) => {
          if (editingProject) {
            await handleSaveProject({ ...data, id: editingProject.id });
          } else {
            await handleSaveProject(data);
          }
        }}
      />

      {/* Project Case Study Deep-Dive Modal */}
      <ProjectCaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

      {/* Client Inquiries Drawer / Modal */}
      <InquiriesModal
        isOpen={isInquiriesOpen}
        messages={inquiries}
        onClose={() => setIsInquiriesOpen(false)}
        onDeleteMessage={handleDeleteMessage}
      />

      {/* Backend Architecture & Storage Modal */}
      <BackendDocsModal
        isOpen={isBackendDocsOpen}
        onClose={() => setIsBackendDocsOpen(false)}
      />
    </div>
  );
}
