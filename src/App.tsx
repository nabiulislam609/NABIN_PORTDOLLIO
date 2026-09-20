import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBubbles } from './components/FloatingBubbles.tsx';
import { MouseGlow } from './components/MouseGlow.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Services } from './components/Services.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminBar } from './components/AdminBar.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { ProfileEditModal } from './components/ProfileEditModal.tsx';
import { InquiriesModal } from './components/InquiriesModal.tsx';
import { BackendDocsModal } from './components/BackendDocsModal.tsx';
import { ProjectFormModal } from './components/ProjectFormModal.tsx';
import { ProjectCaseStudyModal } from './components/ProjectCaseStudyModal.tsx';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from './data/defaultData.ts';
import { ProfileConfig, Project, ContactMessage } from './types.ts';
import {
  apiGetProfile,
  apiSaveProfile,
  apiGetProjects,
  apiSaveProject,
  apiDeleteProject,
  apiResetProjects,
  apiGetInquiries,
  apiDeleteInquiry,
  apiVerifyToken,
  apiChangePassword,
} from './services/apiService.ts';

export default function App() {
  const [profile, setProfile] = useState<ProfileConfig>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

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

    // Check if opened with #admin or ?admin
    const checkAdminIntent = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || hash === '#login' || search.includes('admin') || search.includes('login')) {
        setIsAdminLoginOpen(true);
      }
    };
    checkAdminIntent();
    window.addEventListener('hashchange', checkAdminIntent);

    // Keyboard shortcut for owner: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminLoginOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminIntent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchProfile, fetchProjects, fetchInquiries]);

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
      setIsAdminLoginOpen(true);
      return;
    }

    const updated = await apiSaveProject(adminToken, projectData);
    setProjects(updated);
  };

  const handleDeleteProject = async (id: string) => {
    if (!adminToken) {
      setIsAdminLoginOpen(true);
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
      setIsAdminLoginOpen(true);
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

  // Inquiry Delete Handler
  const handleDeleteMessage = async (id: string) => {
    if (!adminToken) return;
    const updated = await apiDeleteInquiry(adminToken, id);
    setInquiries(updated);
  };

  // Smooth scroll helpers
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navHeight = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setPrefilledSubject(serviceTitle);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F2F5FA] relative selection:bg-[#3A4A63] selection:text-white">
      {/* Background Ambience: Floating Bubbles & Dynamic Mouse Glow */}
      <FloatingBubbles />
      <MouseGlow />

      {/* Primary Sticky Navigation Bar */}
      <Navbar
        profile={profile}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
        onOpenProfileSettings={() => setIsProfileEditOpen(true)}
      />

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
          onRequestAdmin={() => setIsAdminLoginOpen(true)}
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

      {/* Footer */}
      <Footer
        profile={profile}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
      />

      {/* Admin Floating Control Bar (visible when logged in) */}
      {isAdmin && (
        <AdminBar
          unreadInquiriesCount={inquiries.length}
          onAddNewProject={() => {
            setEditingProject(null);
            setIsProjectFormOpen(true);
          }}
          onOpenProfileSettings={() => setIsProfileEditOpen(true)}
          onOpenInquiries={() => setIsInquiriesOpen(true)}
          onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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
