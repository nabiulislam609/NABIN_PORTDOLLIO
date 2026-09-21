import React from 'react';
import { PlusCircle, Settings, Mail, ShieldAlert, LogOut, Database, Palette, RotateCcw } from 'lucide-react';
import { PhotoshopColorBox } from './PhotoshopColorBox.tsx';
import { DEFAULT_BACKGROUND_COLOR, normalizeHex } from '../utils/theme.ts';

interface AdminBarProps {
  unreadInquiriesCount: number;
  themeColor?: string;
  onOpenThemePicker?: () => void;
  onResetTheme?: () => void;
  currentBgColor?: string;
  onOpenBgColorPlate?: () => void;
  onResetBgColor?: () => void;
  onAddNewProject: () => void;
  onOpenProfileSettings: () => void;
  onOpenInquiries: () => void;
  onOpenBackendDocs: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  unreadInquiriesCount,
  themeColor,
  onOpenThemePicker,
  onResetTheme,
  currentBgColor,
  onOpenBgColorPlate,
  onResetBgColor,
  onAddNewProject,
  onOpenProfileSettings,
  onOpenInquiries,
  onOpenBackendDocs,
  onLogout,
}) => {
  const bgHex = normalizeHex(currentBgColor || DEFAULT_BACKGROUND_COLOR);
  const isCustomBg = bgHex.toLowerCase() !== DEFAULT_BACKGROUND_COLOR.toLowerCase();

  return (
    <aside
      aria-label="Admin Control Toolbar"
      id="admin-management-bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#0A0E1A]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl px-4 py-2.5 shadow-2xl shadow-emerald-950/40 flex items-center gap-2 sm:gap-3 max-w-[95vw] overflow-x-auto"
    >
      <div className="flex items-center gap-2 pr-2 border-r border-[#232E45] shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          Admin Mode
        </span>
      </div>

      {/* Website Background Color Plate Quick Trigger */}
      {onOpenBgColorPlate && (
        <div className="pr-2 border-r border-[#232E45] shrink-0 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBgColorPlate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#151F36] hover:bg-[#1E2942] border border-[#232E45] hover:border-cyan-400/50 text-[#F2F5FA] text-xs font-semibold transition-all cursor-pointer"
            title="Website Background Color Plate"
            id="admin-bg-plate-btn"
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/70 shadow-sm shrink-0"
              style={{ backgroundColor: bgHex }}
            />
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>BG</span>
          </button>

          {isCustomBg && onResetBgColor && (
            <button
              type="button"
              onClick={onResetBgColor}
              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-rose-300 hover:text-white transition-colors cursor-pointer"
              title="Reset background color to default (#0A0E1A)"
              id="admin-reset-bg-btn"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Photoshop Theme Color Box Widget */}
      {onOpenThemePicker && (
        <div className="pr-2 border-r border-[#232E45] shrink-0 flex items-center">
          <PhotoshopColorBox
            currentColor={themeColor || '#06B6D4'}
            compact={true}
            onClick={onOpenThemePicker}
            onResetToDefault={onResetTheme}
            showResetButton={true}
          />
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAddNewProject}
          className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          id="admin-add-project-quick-btn"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>

        <button
          onClick={onOpenProfileSettings}
          className="px-3 py-1.5 rounded-lg bg-[#1A2438] hover:bg-[#232E45] text-[#F2F5FA] border border-[#232E45] text-xs font-medium flex items-center gap-1.5 transition-colors"
          id="admin-profile-settings-btn"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Profile Settings</span>
        </button>

        <button
          onClick={onOpenInquiries}
          className="px-3 py-1.5 rounded-lg bg-[#1A2438] hover:bg-[#232E45] text-[#F2F5FA] border border-[#232E45] text-xs font-medium flex items-center gap-1.5 transition-colors relative"
          id="admin-inquiries-btn"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Inquiries</span>
          {unreadInquiriesCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-black font-extrabold text-[10px] rounded-full">
              {unreadInquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenBackendDocs}
          className="px-3 py-1.5 rounded-lg bg-[#1A2438] hover:bg-[#232E45] text-[#AAB8CE] hover:text-[#F2F5FA] border border-[#232E45] text-xs font-medium flex items-center gap-1.5 transition-colors"
          id="admin-backend-docs-btn"
        >
          <Database className="w-3.5 h-3.5 text-[#B8C6DC]" />
          <span className="hidden md:inline">DB Architecture</span>
        </button>

        <button
          onClick={onLogout}
          title="Log out of Admin"
          className="p-1.5 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 transition-colors ml-1"
          id="admin-logout-btn"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
