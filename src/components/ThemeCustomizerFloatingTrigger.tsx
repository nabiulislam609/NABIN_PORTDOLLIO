import React, { useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { DEFAULT_THEME_COLOR, normalizeHex } from '../utils/theme.ts';

interface ThemeCustomizerFloatingTriggerProps {
  currentColor: string;
  onOpenColorPicker: () => void;
  onResetToDefault: () => void;
}

export const ThemeCustomizerFloatingTrigger: React.FC<ThemeCustomizerFloatingTriggerProps> = ({
  currentColor,
  onOpenColorPicker,
  onResetToDefault,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hex = normalizeHex(currentColor || DEFAULT_THEME_COLOR);
  const isDefault = hex.toLowerCase() === DEFAULT_THEME_COLOR.toLowerCase();

  return (
    <div
      id="floating-theme-customizer-dock"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Quick Reset Button if customized */}
      {!isDefault && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onResetToDefault();
          }}
          title="Reset to main Cyan theme"
          id="floating-reset-theme-btn"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0A0E1A]/95 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-semibold shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer animate-fade-in"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Main Color</span>
        </button>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={onOpenColorPicker}
        id="floating-open-color-picker-btn"
        title="Customize Website Color (Opens Photoshop Color Picker)"
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#0A0E1A]/95 hover:bg-[#151F36] border border-[#2B3B5C] hover:border-white/40 shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer"
        style={{
          boxShadow: `0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px var(--theme-primary-glow)`,
        }}
      >
        {/* Photoshop overlapping dual squares */}
        <div className="relative w-6 h-6 shrink-0 select-none">
          {/* Background square */}
          <div className="absolute right-0 bottom-0 w-4 h-4 bg-[#0B1120] border border-[#485978] rounded-[2px]" />
          {/* Foreground active theme color square */}
          <div
            className="relative z-10 w-4.5 h-4.5 rounded-[2px] border border-white/90 shadow-sm"
            style={{ backgroundColor: hex }}
          />
        </div>

        {/* Text Label */}
        <div className="flex items-center gap-1.5 pr-1">
          <Palette className="w-3.5 h-3.5 text-white/80" />
          <span className="text-xs font-bold text-white tracking-wide">
            Theme Color
          </span>
          <span
            className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-white/10"
            style={{
              backgroundColor: 'var(--theme-primary-tint)',
              color: 'var(--theme-primary)',
            }}
          >
            {hex}
          </span>
        </div>
      </button>
    </div>
  );
};
