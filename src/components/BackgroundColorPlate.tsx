import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  RotateCcw,
  Check,
  X,
  Pipette,
  Sparkles,
  Sliders,
} from 'lucide-react';
import {
  DEFAULT_BACKGROUND_COLOR,
  BACKGROUND_COLOR_PRESETS,
  normalizeHex,
  isValidHex,
  applyWebsiteBackgroundColor,
  getSavedBackgroundColor,
} from '../utils/theme.ts';

interface BackgroundColorPlateProps {
  currentBgColor: string;
  onUpdateBgColor: (color: string) => void;
  onResetBgColor: () => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  showFloatingDock?: boolean;
}

export const BackgroundColorPlate: React.FC<BackgroundColorPlateProps> = ({
  currentBgColor,
  onUpdateBgColor,
  onResetBgColor,
  isOpenExternal,
  onCloseExternal,
  showFloatingDock = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = (open: boolean) => {
    if (onCloseExternal && !open) {
      onCloseExternal();
    }
    setInternalOpen(open);
  };

  const activeColor = normalizeHex(currentBgColor || getSavedBackgroundColor());
  const isDefault =
    activeColor.toLowerCase() === DEFAULT_BACKGROUND_COLOR.toLowerCase();

  const [customHex, setCustomHex] = useState(activeColor.replace('#', ''));
  const [hexError, setHexError] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Sync custom input when activeColor changes
  useEffect(() => {
    setCustomHex(activeColor.replace('#', ''));
    setHexError(false);
  }, [activeColor]);

  // Click outside to close popover
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#floating-bg-plate-trigger') &&
        !(e.target as HTMLElement).closest('#nav-bg-color-btn')
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectPreset = (hex: string) => {
    onUpdateBgColor(hex);
  };

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
    setCustomHex(val);
    if (val.length === 6) {
      setHexError(false);
      onUpdateBgColor('#' + val);
    }
  };

  const handleNativeColorPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val.replace('#', '').toUpperCase());
    onUpdateBgColor(val);
  };

  const handleReset = () => {
    onResetBgColor();
    setCustomHex(DEFAULT_BACKGROUND_COLOR.replace('#', ''));
    setHexError(false);
  };

  return (
    <>
      {/* Floating Bottom-Left Color Plate Quick Trigger (Only shown if enabled) */}
      {showFloatingDock && (
        <div
          id="floating-bg-plate-dock"
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2"
        >
          {/* Quick Reset Button (Visible whenever background is not default) */}
          {!isDefault && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset background color to default (#0A0E1A)"
              id="floating-quick-reset-bg-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0A0E1A]/95 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-semibold shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer animate-fade-in"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset BG</span>
            </button>
          )}

          {/* Main Floating Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            id="floating-bg-plate-trigger"
            title="Change Full Website Background Color"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#0A0E1A]/95 hover:bg-[#151F36] border border-[#2B3B5C] hover:border-cyan-400/60 shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer group"
            style={{
              boxShadow: `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 16px ${activeColor}40`,
            }}
          >
            {/* Color Plate Swatch Indicator */}
            <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
              {/* Outer border ring */}
              <div
                className="w-5 h-5 rounded-full border-2 border-white/70 shadow-md group-hover:scale-110 transition-transform"
                style={{ backgroundColor: activeColor }}
              />
            </div>

            <div className="flex items-center gap-1.5 pr-1">
              <Palette className="w-3.5 h-3.5 text-cyan-300 group-hover:text-cyan-200" />
              <span className="text-xs font-bold text-white tracking-wide">
                BG Color
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 font-semibold border border-white/10">
                {activeColor}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Background Color Plate Popover / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Website Background Color Plate"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start p-4 sm:p-6 sm:pl-8 pointer-events-none"
        >
          {/* Subtle backdrop overlay on mobile */}
          <div
            className="fixed inset-0 bg-black/40 sm:bg-transparent pointer-events-auto sm:pointer-events-none"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={modalRef}
            id="bg-color-plate-modal"
            className="pointer-events-auto relative w-full max-w-sm sm:max-w-md bg-[#0F1423]/95 backdrop-blur-2xl border border-[#293652] rounded-2xl shadow-2xl p-5 overflow-hidden text-white animate-fade-in"
            style={{
              boxShadow: `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.15)`,
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#232E45]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Website Background Color
                  </h3>
                  <p className="text-[11px] text-[#AAB8CE]">
                    Change the full site background with color plate
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#8899B8] hover:text-white hover:bg-[#1A2438] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Color Preview & Quick Reset Bar */}
            <div className="mt-4 p-3 rounded-xl bg-[#161E30] border border-[#23314D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-white/60 shadow-md shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: activeColor }}
                >
                  <Sparkles
                    className={`w-4 h-4 ${
                      activeColor.toLowerCase() > '#888888'
                        ? 'text-gray-900'
                        : 'text-white'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white tracking-wide">
                      {activeColor}
                    </span>
                    {isDefault ? (
                      <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
                        Default
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#8899B8]">
                    Applied across entire website
                  </p>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                id="plate-reset-btn"
                title="Reset to default background (#0A0E1A)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isDefault
                    ? 'opacity-40 bg-[#1F2B42] text-[#8899B8] cursor-not-allowed'
                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 shadow-sm'
                }`}
                disabled={isDefault}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Curated Color Plate Swatches */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#B8C6DC] flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  Color Plate Presets
                </span>
                <span className="text-[10px] text-[#6D7F9B]">
                  Click to preview instantly
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {BACKGROUND_COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    activeColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleSelectPreset(preset.hex)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C263D] border-cyan-400 shadow-md ring-1 ring-cyan-400'
                          : 'bg-[#131B2C] border-[#222E46] hover:bg-[#182338] hover:border-[#35476B]'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg border border-white/40 shrink-0 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              preset.hex.toLowerCase() > '#888888'
                                ? 'text-black'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-semibold text-white truncate">
                          {preset.name.split(' (')[0]}
                        </span>
                        <span className="text-[9px] font-mono text-[#8899B8]">
                          {preset.hex}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Eyedropper & Hex Input */}
            <div className="mt-4 pt-3.5 border-t border-[#232E45]">
              <span className="text-xs font-semibold text-[#B8C6DC] mb-2 block">
                Custom Color Plate Picker
              </span>
              <div className="flex items-center gap-2">
                {/* HTML5 Native Color Picker Button */}
                <label
                  title="Open Color Wheel"
                  className="relative flex items-center justify-center w-10 h-9 rounded-xl bg-[#161E30] hover:bg-[#1E2942] border border-[#2E3E5E] cursor-pointer transition-colors shrink-0"
                >
                  <input
                    type="color"
                    value={activeColor}
                    onChange={handleNativeColorPick}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <Pipette className="w-4 h-4 text-cyan-400" />
                </label>

                {/* Direct Hex Input */}
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3 text-xs font-mono font-bold text-[#8899B8]">
                    #
                  </span>
                  <input
                    type="text"
                    value={customHex}
                    maxLength={6}
                    onChange={handleCustomHexChange}
                    placeholder="0A0E1A"
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-[#161E30] border border-[#2E3E5E] focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-gray-500 uppercase"
                  />
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isValidHex('#' + customHex)) {
                      onUpdateBgColor('#' + customHex);
                    } else {
                      setHexError(true);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  Apply
                </button>
              </div>

              {hexError && (
                <p className="text-[10px] text-rose-400 mt-1">
                  Please enter a valid 6-character hex color code.
                </p>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-4 pt-3 border-t border-[#232E45] flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                id="plate-footer-reset-btn"
                className="text-xs font-medium text-[#8899B8] hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Default (#0A0E1A)
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#23314D] hover:bg-[#2F4166] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
