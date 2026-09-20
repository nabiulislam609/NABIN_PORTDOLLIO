import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Database, Server, Shield, Cloud, Terminal, Check, Copy } from 'lucide-react';

interface BackendDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDocsModal: React.FC<BackendDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

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

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read projects and public profile info
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /profile/{profileId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    // Public visitors can submit contact messages, only admin can read
    match /messages/{messageId} {
      allow create: if request.resource.data.email is string
                    && request.resource.data.message.size() > 0;
      allow read, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}`;

  const jsonSchemaExample = `{
  "Project": {
    "id": "string (UUID)",
    "title": "string",
    "category": "string (Meta Ads | Google Ads | Local SEO | ...)",
    "image": "string (URL or base64)",
    "description": "string",
    "goals": "string",
    "workCompleted": ["string"],
    "results": "string",
    "projectUrl": "string (URL)",
    "date": "string (e.g. 2025)",
    "clientIndustry": "string",
    "strategy": "string",
    "toolsUsed": ["string"]
  },
  "ContactMessage": {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "createdAt": "ISO 8601 string",
    "status": "'unread' | 'read'"
  }
}`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backend-docs-title"
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 id="backend-docs-title" className="text-xl font-bold text-white">
              Backend Architecture & Storage Specifications
            </h3>
            <p className="text-xs text-[#AAB8CE]">
              Persistent storage, REST API endpoints, and cloud database blueprints.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#AAB8CE]">
          {/* Active Backend Overview */}
          <div className="p-4 rounded-xl bg-[#1A2438]/70 border border-[#232E45]">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Active Full-Stack Architecture (In Production)
            </h4>
            <p className="text-xs leading-relaxed text-[#B8C6DC]">
              The application runs an integrated Express + Vite full-stack server (<code className="text-cyan-300">server.ts</code>) binding on port 3000. All portfolio mutations (Create, Update, Delete), personal configuration updates, and incoming contact form submissions are stored persistently inside the <code className="text-cyan-300">/data/</code> directory (<code className="text-cyan-300">projects.json</code>, <code className="text-cyan-300">profile.json</code>, <code className="text-cyan-300">messages.json</code>).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <div className="font-bold text-white">GET /api/projects</div>
                <div className="text-[#AAB8CE]">Public list</div>
              </div>
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <div className="font-bold text-white">POST /api/projects</div>
                <div className="text-emerald-400">Protected Admin</div>
              </div>
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <div className="font-bold text-white">POST /api/contact</div>
                <div className="text-white">Validated Inquiry</div>
              </div>
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <div className="font-bold text-white">POST /api/auth/login</div>
                <div className="text-cyan-300">Admin Session</div>
              </div>
            </div>
          </div>

          {/* Database Schema */}
          <div className="p-4 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Data Model & Entity Schema
              </h4>
              <button
                onClick={() => copyCode(jsonSchemaExample, 'schema')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'schema' ? 'Copied' : 'Copy Schema'}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-[#0A0E1A] text-[11px] text-[#B8C6DC] overflow-x-auto border border-[#232E45]">
              {jsonSchemaExample}
            </pre>
          </div>

          {/* Firebase / Supabase Blueprint */}
          <div className="p-4 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Firestore Security Rules (For Cloud Migration)
              </h4>
              <button
                onClick={() => copyCode(firestoreRules, 'rules')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedSection === 'rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'rules' ? 'Copied' : 'Copy Rules'}
              </button>
            </div>
            <p className="text-[11px] text-[#AAB8CE] mb-2">
              If deploying with Firebase Firestore, authenticate your admin user via Firebase Auth custom claims and deploy these rules:
            </p>
            <pre className="p-3 rounded-lg bg-[#0A0E1A] text-[11px] text-emerald-300 overflow-x-auto border border-[#232E45]">
              {firestoreRules}
            </pre>
          </div>

          {/* Build and Deployment Commands */}
          <div className="p-4 rounded-xl bg-[#1A2438]/50 border border-[#232E45]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              Build & Deployment Commands
            </h4>
            <div className="space-y-2 text-[11px] font-mono text-[#B8C6DC]">
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <span className="text-[#AAB8CE]"># Local / Dev Server:</span>
                <div className="text-white">npm run dev</div>
              </div>
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <span className="text-[#AAB8CE]"># Production Build:</span>
                <div className="text-white">npm run build</div>
              </div>
              <div className="bg-[#0A0E1A] p-2 rounded-lg border border-[#232E45]">
                <span className="text-[#AAB8CE]"># Start Production Server:</span>
                <div className="text-white">npm start</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-[#232E45] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1A2438] hover:bg-[#232E45] text-xs font-semibold text-white transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
