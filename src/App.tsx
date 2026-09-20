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
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from './data/defaultData.ts';
import { ProfileConfig, Project, ContactMessage } from './types.ts';

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
  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Initial Data Fetching
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.warn('Using local default profile:', e);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      }
    } catch (e) {
      console.warn('Using local default projects:', e);
    }
  }, []);

  const fetchInquiries = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/contact/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.error('Error fetching inquiries:', e);
    }
  }, []);

  // Check saved admin token on boot
  useEffect(() => {
    fetchProfile();
    fetchProjects();

    const savedToken = localStorage.getItem('portfolio_admin_token');
    if (savedToken) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setIsAdmin(true);
            setAdminToken(savedToken);
            fetchInquiries(savedToken);
          } else {
            localStorage.removeItem('portfolio_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('portfolio_admin_token');
        });
    }
  }, [fetchProfile, fetchProjects, fetchInquiries]);

  // Auth Handlers
  const handleLoginSuccess = (token: string) => {
    setIsAdmin(true);
    setAdminToken(token);
    localStorage.setItem('portfolio_admin_token', token);
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

    const isEdit = Boolean(projectData.id);
    const url = isEdit ? `/api/projects/${projectData.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save project');
    }

    await fetchProjects();
  };

  const handleDeleteProject = async (id: string) => {
    if (!adminToken) {
      setIsAdminLoginOpen(true);
      return;
    }

    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (!res.ok) {
      alert('Failed to delete project');
      return;
    }

    await fetchProjects();
  };

  const handleResetProjects = async () => {
    if (!adminToken) return;
    if (confirm('Reset portfolio to original default curated case studies?')) {
      const res = await fetch('/api/projects/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        await fetchProjects();
      }
    }
  };

  // Profile Update Handler
  const handleSaveProfile = async (updatedProfile: ProfileConfig) => {
    if (!adminToken) {
      setIsAdminLoginOpen(true);
      return;
    }

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updatedProfile),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save profile');
    }

    setProfile(updatedProfile);
  };

  // Password Change Handler
  const handleChangePassword = async (newPassword: string) => {
    if (!adminToken) return;
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update password');
    }
  };

  // Inquiry Delete Handler
  const handleDeleteMessage = async (id: string) => {
    if (!adminToken) return;
    await fetch(`/api/contact/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setInquiries((prev) => prev.filter((m) => m.id !== id));
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
            scrollToSection('portfolio');
            // Trigger add project button in portfolio
            const btn = document.getElementById('portfolio-add-project-btn');
            if (btn) btn.click();
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
