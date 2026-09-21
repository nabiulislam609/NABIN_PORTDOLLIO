import React from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { DEFAULT_THEME_COLOR, normalizeHex } from '../utils/theme.ts';

interface PhotoshopColorBoxProps {
  currentColor: string;
  onClick: () => void;
  onDoubleClick?: () => void;
  onResetToDefault?: () => void;
  showResetButton?: boolean;
  showLabel?: boolean;
  compact?: boolean;
}

export const PhotoshopColorBox: React.FC<PhotoshopColorBoxProps> = ({
  currentColor,
  onClick,
  onDoubleClick,
  onResetToDefault,
  showResetButton = true,
  showLabel = true,
  compact = false,
}) => {
  const hex = normalizeHex(currentColor || DEFAULT_THEME_COLOR);
  const isDefault = hex.toLowerCase() === DEFAULT_THEME_COLOR.toLowerCase();

  const handleBoxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleBoxDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDoubleClick) {
      onDoubleClick();
    } else {
      onClick();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Compact Photoshop Swatch Widget */}
        <div
          onClick={handleBoxClick}
          onDoubleClick={handleBoxDoubleClick}
          className="relative w-9 h-9 bg-[#1E2536] hover:bg-[#253046] border border-[#33425E] rounded-lg p-1 cursor-pointer transition-all shadow-md group"
          title="Click or double-click to customize website theme color"
        >
          {/* Background offset square */}
          <div className="absolute right-1.5 bottom-1.5 w-4 h-4 bg-[#0A0E1A] border border-[#485978] rounded-[2px]" />

          {/* Foreground active theme color square */}
          <div
            className="relative z-10 w-4.5 h-4.5 rounded-[2px] border border-white/60 shadow-sm transition-transform group-hover:scale-105"
            style={{ backgroundColor: hex }}
          />

          {/* Miniature swap arrow */}
          <div className="absolute top-0.5 right-0.5 text-[#8899B8] group-hover:text-white transition-colors">
            <ArrowUpDown className="w-2 h-2" />
          </div>
        </div>

        {showResetButton && !isDefault && onResetToDefault && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResetToDefault();
            }}
            title="Reset theme to original Cyan"
            className="p-1 rounded-md bg-[#182235] hover:bg-[#23314D] border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 bg-[#121929] border border-[#23314D] rounded-xl p-3.5 shadow-lg">
      {/* Photoshop Toolbar Style Dual Swatch Box */}
      <div className="flex items-center gap-3">
        <div
          onClick={handleBoxClick}
          onDoubleClick={handleBoxDoubleClick}
          className="relative w-14 h-14 bg-[#1A2337] hover:bg-[#202C45] border-2 border-[#2E3E5E] hover:border-cyan-500/60 rounded-xl p-2 cursor-pointer transition-all shadow-md group select-none"
          title="Double click to open Color Picker"
          id="photoshop-color-box-widget"
        >
          {/* Background offset secondary square */}
          <div
            className="absolute right-2 bottom-2 w-7 h-7 bg-[#0A0E1A] border border-[#3A4B6B] rounded-[3px] shadow-sm"
            title="Background Color"
          />

          {/* Foreground active theme color square */}
          <div
            className="relative z-10 w-7 h-7 rounded-[3px] border border-white/80 shadow-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: hex }}
            title={`Active Theme Color: ${hex} (Click to change)`}
          />

          {/* Top-Right Swap Arrow */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="absolute top-1 right-1 text-[#8A9EB8] group-hover:text-cyan-300 hover:scale-110 transition-all p-0.5 cursor-pointer"
            title="Click to change theme color"
          >
            <ArrowUpDown className="w-2.5 h-2.5" />
          </div>

          {/* Bottom-Left Reset Icon */}
          {onResetToDefault && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onResetToDefault();
              }}
              className="absolute bottom-1 left-1 text-[#8A9EB8] group-hover:text-cyan-300 hover:scale-110 transition-all p-0.5 cursor-pointer"
              title="Click to reset default theme"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </div>
          )}
        </div>

        {showLabel && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Website Theme Color
              </span>
              <span
                className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--theme-primary-glow)]"
                style={{ backgroundColor: hex }}
              />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono font-bold text-cyan-300 bg-[#0B1120] px-2 py-0.5 rounded border border-[#23314D]">
                {hex}
              </span>
              <span className="text-[11px] text-[#8EA0BA]">
                {isDefault ? '(Default Cyan)' : '(Custom Theme)'}
              </span>
            </div>
            <span className="text-[10px] text-[#6E809C] mt-0.5">
              Click / Double click to open Color Picker
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons: Open Picker + Reset Button */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={onClick}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#202C45] to-[#2B3B5C] hover:from-[#2B3B5C] hover:to-[#384C75] text-[#F2F5FA] border border-[#3A4D75] text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          id="open-color-picker-btn"
        >
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/50 inline-block"
            style={{ backgroundColor: hex }}
          />
          <span>Change Color</span>
        </button>

        {showResetButton && onResetToDefault && (
          <button
            type="button"
            onClick={onResetToDefault}
            disabled={isDefault}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isDefault
                ? 'opacity-40 bg-[#151D2F] border-[#222E46] text-[#71829B] cursor-not-allowed'
                : 'bg-rose-950/30 hover:bg-rose-950/60 border-rose-500/40 text-rose-300 hover:text-white shadow-sm'
            }`}
            id="reset-theme-btn"
            title="Reset to main default Cyan theme"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Theme</span>
          </button>
        )}
      </div>
    </div>
  );
};
