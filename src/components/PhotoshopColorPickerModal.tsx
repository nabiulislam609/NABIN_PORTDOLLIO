import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette, RotateCcw, X, Check, Palette } from 'lucide-react';
import {
  DEFAULT_THEME_COLOR,
  THEME_PRESETS,
  HSB,
  RGB,
  hexToRgb,
  rgbToHex,
  rgbToHsb,
  hsbToRgb,
  rgbToCmyk,
  snapToWebSafe,
  normalizeHex,
  isValidHex,
} from '../utils/theme.ts';

interface PhotoshopColorPickerModalProps {
  isOpen: boolean;
  currentColor: string;
  onApplyTheme: (hex: string) => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

export const PhotoshopColorPickerModal: React.FC<PhotoshopColorPickerModalProps> = ({
  isOpen,
  currentColor,
  onApplyTheme,
  onResetToDefault,
  onClose,
}) => {
  const initialHex = normalizeHex(currentColor || DEFAULT_THEME_COLOR);
  const [selectedHex, setSelectedHex] = useState<string>(initialHex);
  const [originalHex, setOriginalHex] = useState<string>(initialHex);

  // Color representations in sync
  const [hsb, setHsb] = useState<HSB>(() => {
    const rgb = hexToRgb(initialHex);
    return rgbToHsb(rgb.r, rgb.g, rgb.b);
  });
  const [rgb, setRgb] = useState<RGB>(() => hexToRgb(initialHex));
  const [hexInput, setHexInput] = useState<string>(initialHex.replace('#', ''));
  const [onlyWebColors, setOnlyWebColors] = useState<boolean>(false);
  const [showSwatches, setShowSwatches] = useState<boolean>(false);
  const [activeModelRadio, setActiveModelRadio] = useState<'H' | 'S' | 'B' | 'R' | 'G' | 'B'>('H');

  const satValBoxRef = useRef<HTMLDivElement | null>(null);
  const hueBarRef = useRef<HTMLDivElement | null>(null);

  // Sync state whenever modal opens or currentColor changes externally
  useEffect(() => {
    if (isOpen) {
      const valid = normalizeHex(currentColor || DEFAULT_THEME_COLOR);
      setSelectedHex(valid);
      setOriginalHex(valid);
      const newRgb = hexToRgb(valid);
      setRgb(newRgb);
      setHsb(rgbToHsb(newRgb.r, newRgb.g, newRgb.b));
      setHexInput(valid.replace('#', ''));
    }
  }, [isOpen, currentColor]);

  // Update all color representations from an HSB source
  const updateFromHsb = useCallback(
    (newHsb: HSB, enforceWeb = onlyWebColors) => {
      let newRgb = hsbToRgb(newHsb.h, newHsb.s, newHsb.b);
      if (enforceWeb) {
        newRgb = snapToWebSafe(newRgb);
      }
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setHsb(newHsb);
      setRgb(newRgb);
      setSelectedHex(newHex);
      setHexInput(newHex.replace('#', ''));
    },
    [onlyWebColors]
  );

  // Update all color representations from an RGB source
  const updateFromRgb = useCallback(
    (newRgb: RGB, enforceWeb = onlyWebColors) => {
      const effectiveRgb = enforceWeb ? snapToWebSafe(newRgb) : newRgb;
      const newHsb = rgbToHsb(effectiveRgb.r, effectiveRgb.g, effectiveRgb.b);
      const newHex = rgbToHex(effectiveRgb.r, effectiveRgb.g, effectiveRgb.b);
      setHsb(newHsb);
      setRgb(effectiveRgb);
      setSelectedHex(newHex);
      setHexInput(newHex.replace('#', ''));
    },
    [onlyWebColors]
  );

  // Update all from Hex
  const updateFromHex = useCallback(
    (input: string) => {
      const clean = input.replace(/[^0-9A-Fa-f]/g, '');
      setHexInput(clean);
      if (clean.length === 6) {
        const full = '#' + clean;
        if (isValidHex(full)) {
          const newRgb = hexToRgb(full);
          const effectiveRgb = onlyWebColors ? snapToWebSafe(newRgb) : newRgb;
          const newHsb = rgbToHsb(effectiveRgb.r, effectiveRgb.g, effectiveRgb.b);
          const validHex = rgbToHex(effectiveRgb.r, effectiveRgb.g, effectiveRgb.b);
          setSelectedHex(validHex);
          setRgb(effectiveRgb);
          setHsb(newHsb);
        }
      }
    },
    [onlyWebColors]
  );

  // Handle Saturation & Brightness Dragging (2D field)
  const handleSatValMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const box = satValBoxRef.current;
    if (!box) return;

    const updatePoint = (clientX: number, clientY: number) => {
      const rect = box.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = Math.round((x / rect.width) * 100);
      const b = Math.round((1 - y / rect.height) * 100);

      updateFromHsb({ ...hsb, s, b });
    };

    updatePoint(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updatePoint(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Handle Hue Spectrum Dragging (Vertical bar: 360 at top to 0 at bottom)
  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const bar = hueBarRef.current;
    if (!bar) return;

    const updateHue = (clientY: number) => {
      const rect = bar.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      // In Photoshop hue bar: top is 360/0 (Red) down through Magenta, Blue, Cyan, Green, Yellow, back to Red
      const ratio = 1 - y / rect.height;
      const h = Math.round(ratio * 360) % 360;

      updateFromHsb({ ...hsb, h });
    };

    updateHue(e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updateHue(moveEvent.clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Native EyeDropper API support
  const handleEyedropper = async () => {
    // @ts-expect-error EyeDropper is a modern browser web API
    if (typeof window !== 'undefined' && window.EyeDropper) {
      try {
        // @ts-expect-error EyeDropper is a modern browser web API
        const dropper = new window.EyeDropper();
        const result = await dropper.open();
        if (result && result.sRGBHex) {
          updateFromHex(result.sRGBHex);
        }
      } catch {
        // User cancelled eyedropper
      }
    }
  };

  // Apply changes & close
  const handleApply = () => {
    onApplyTheme(selectedHex);
    onClose();
  };

  // Reset to original default cyan theme
  const handleResetToDefault = () => {
    onResetToDefault();
    setSelectedHex(DEFAULT_THEME_COLOR);
    const newRgb = hexToRgb(DEFAULT_THEME_COLOR);
    setRgb(newRgb);
    setHsb(rgbToHsb(newRgb.r, newRgb.g, newRgb.b));
    setHexInput(DEFAULT_THEME_COLOR.replace('#', ''));
    onClose();
  };

  if (!isOpen) return null;

  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const pureHueHex = rgbToHex(...Object.values(hsbToRgb(hsb.h, 100, 100)) as [number, number, number]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photoshop-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in select-none"
    >
      {/* Photoshop Modal Window Frame */}
      <div className="w-full max-w-[620px] bg-[#383838] text-[#E0E0E0] rounded-xl border border-[#505050] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col font-sans text-xs">
        {/* Title Bar */}
        <div className="bg-[#2B2B2B] px-4 py-2.5 flex items-center justify-between border-b border-[#1E1E1E]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F39C2B]"></span>
            <h2 id="photoshop-picker-title" className="text-xs font-bold text-[#E8E8E8] tracking-wide">
              Color Picker (Website Theme)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#AAAAAA] hover:text-white hover:bg-[#404040] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Top prompt line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#CCCCCC] font-medium">
              <span>Select Color:</span>
              {/* @ts-expect-error EyeDropper check */}
              {typeof window !== 'undefined' && Boolean(window.EyeDropper) && (
                <button
                  type="button"
                  onClick={handleEyedropper}
                  title="Pick color from screen (Eyedropper)"
                  className="p-1 rounded hover:bg-[#484848] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Pipette className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[11px] text-[#9E9E9E]">
              Current Theme: <span className="font-mono text-white font-bold">{selectedHex}</span>
            </div>
          </div>

          {/* Main Picker Grid */}
          <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
            {/* Left Section: 2D Sat/Val Box + Hue Rainbow Bar */}
            <div className="flex gap-3.5 items-center justify-center mx-auto sm:mx-0">
              {/* 2D Saturation & Brightness Box */}
              <div
                ref={satValBoxRef}
                onMouseDown={handleSatValMouseDown}
                className="relative w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] rounded border border-[#1A1A1A] cursor-crosshair overflow-hidden shadow-inner shrink-0"
                style={{ backgroundColor: pureHueHex }}
              >
                {/* Horizontal white saturation gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
                {/* Vertical black brightness gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
                  }}
                />
                {/* Circular indicator thumb */}
                <div
                  className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_2px_1px_rgba(0,0,0,0.8)] pointer-events-none"
                  style={{
                    left: `${hsb.s}%`,
                    top: `${100 - hsb.b}%`,
                  }}
                />
              </div>

              {/* Vertical Hue Rainbow Spectrum Bar (0° to 360°) */}
              <div
                ref={hueBarRef}
                onMouseDown={handleHueMouseDown}
                className="relative w-8 h-[220px] sm:h-[240px] rounded border border-[#1A1A1A] cursor-pointer shadow-inner shrink-0"
                style={{
                  background:
                    'linear-gradient(to bottom, #ff0000 0%, #ff00ff 17%, #0000ff 33%, #00ffff 50%, #00ff00 67%, #ffff00 83%, #ff0000 100%)',
                }}
              >
                {/* Dual arrow indicator slider on sides */}
                <div
                  className="absolute left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none px-0.5"
                  style={{ top: `${(1 - hsb.h / 360) * 100}%` }}
                >
                  {/* Left pointing arrow */}
                  <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] -ml-1.5" />
                  {/* Right pointing arrow */}
                  <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] -mr-1.5" />
                </div>
              </div>
            </div>

            {/* Right Section: Preview box, Buttons, Inputs */}
            <div className="flex-1 w-full flex flex-col justify-between gap-4">
              {/* Top Row: Dual Color Swatch Preview + Action Buttons */}
              <div className="flex gap-4 items-start justify-between">
                {/* Photoshop split Preview swatch */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-18 rounded border border-[#202020] overflow-hidden flex flex-col shadow-md">
                    {/* Top: New Selected Color */}
                    <div
                      className="flex-1 transition-colors"
                      style={{ backgroundColor: selectedHex }}
                      title="New Theme Color"
                    />
                    {/* Bottom: Current / Original Color (Clicking reverts) */}
                    <button
                      type="button"
                      onClick={() => updateFromHex(originalHex)}
                      className="flex-1 transition-colors relative group cursor-pointer"
                      style={{ backgroundColor: originalHex }}
                      title="Click to restore previous color"
                    >
                      <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white">
                        revert
                      </span>
                    </button>
                  </div>
                  <span className="text-[10px] text-[#A0A0A0] mt-1">new / current</span>
                </div>

                {/* Photoshop Style Action Buttons */}
                <div className="flex flex-col gap-2 flex-1 max-w-[150px]">
                  <button
                    type="button"
                    onClick={handleApply}
                    className="w-full py-1.5 px-4 rounded-full bg-[#484848] hover:bg-[#525252] active:bg-[#3E3E3E] text-white font-medium border border-[#606060] shadow-sm transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    id="color-picker-ok-btn"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>OK</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-1.5 px-4 rounded-full bg-[#383838] hover:bg-[#444444] text-[#D0D0D0] font-medium border border-[#555555] transition-all text-xs cursor-pointer"
                    id="color-picker-cancel-btn"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="w-full py-1.5 px-3 rounded-full bg-[#2E3642] hover:bg-[#3B4656] text-cyan-300 font-medium border border-cyan-500/40 transition-all text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    id="color-picker-reset-default-btn"
                    title="Reset to original Cyan #06B6D4 theme"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Reset Theme</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSwatches(!showSwatches)}
                    className="w-full py-1.5 px-3 rounded-full bg-[#383838] hover:bg-[#444444] text-[#B8B8B8] hover:text-white font-medium border border-[#555555] transition-all text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Palette className="w-3 h-3" />
                    <span>{showSwatches ? 'Hide Swatches' : 'Color Swatches'}</span>
                  </button>
                </div>
              </div>

              {/* Color Values Table (H, S, B, R, G, B, Hex, CMYK) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-[#2E2E2E] p-2.5 rounded-lg border border-[#404040]">
                {/* HSB Column */}
                <div className="space-y-1">
                  {/* Hue */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="colorModel"
                      checked={activeModelRadio === 'H'}
                      onChange={() => setActiveModelRadio('H')}
                      className="accent-[#F39C2B] w-3 h-3"
                    />
                    <span className="w-4 text-[11px] text-[#B0B0B0]">H:</span>
                    <input
                      type="number"
                      min={0}
                      max={360}
                      value={hsb.h}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(360, Number(e.target.value) || 0));
                        updateFromHsb({ ...hsb, h: val });
                      }}
                      className="w-14 bg-[#1E1E1E] border border-[#4A4A4A] text-white px-1.5 py-0.5 rounded text-right text-xs font-mono focus:border-[#F39C2B] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#888]">°</span>
                  </label>

                  {/* Saturation */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="colorModel"
                      checked={activeModelRadio === 'S'}
                      onChange={() => setActiveModelRadio('S')}
                      className="accent-[#F39C2B] w-3 h-3"
                    />
                    <span className="w-4 text-[11px] text-[#B0B0B0]">S:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hsb.s}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        updateFromHsb({ ...hsb, s: val });
                      }}
                      className="w-14 bg-[#1E1E1E] border border-[#4A4A4A] text-white px-1.5 py-0.5 rounded text-right text-xs font-mono focus:border-[#F39C2B] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#888]">%</span>
                  </label>

                  {/* Brightness */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="colorModel"
                      checked={activeModelRadio === 'B'}
                      onChange={() => setActiveModelRadio('B')}
                      className="accent-[#F39C2B] w-3 h-3"
                    />
                    <span className="w-4 text-[11px] text-[#B0B0B0]">B:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hsb.b}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        updateFromHsb({ ...hsb, b: val });
                      }}
                      className="w-14 bg-[#1E1E1E] border border-[#4A4A4A] text-white px-1.5 py-0.5 rounded text-right text-xs font-mono focus:border-[#F39C2B] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#888]">%</span>
                  </label>
                </div>

                {/* RGB Column */}
                <div className="space-y-1">
                  {/* Red */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="colorModel"
                      checked={activeModelRadio === 'R'}
                      onChange={() => setActiveModelRadio('R')}
                      className="accent-[#F39C2B] w-3 h-3"
                    />
                    <span className="w-4 text-[11px] text-[#B0B0B0]">R:</span>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb.r}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                        updateFromRgb({ ...rgb, r: val });
                      }}
                      className="w-14 bg-[#1E1E1E] border border-[#4A4A4A] text-white px-1.5 py-0.5 rounded text-right text-xs font-mono focus:border-[#F39C2B] focus:outline-none"
                    />
                  </label>

                  {/* Green */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="colorModel"
                      checked={activeModelRadio === 'G'}
                      onChange={() => setActiveModelRadio('G')}
                      className="accent-[#F39C2B] w-3 h-3"
                    />
                    <span className="w-4 text-[11px] text-[#B0B0B0]">G:</span>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb.g}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                        updateFromRgb({ ...rgb, g: val });
                      }}
                      className="w-14 bg-[#1E1E1E] border border-[#4A4A4A] text-white px-1.5 py-0.5 rounded text-right text-xs font-mono focus:border-[#F39C2B] focus:outline-none"
                    />
                  </label>

                  {/* Blue */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="colorModel"
                      checked={activeModelRadio === 'B'}
                      onChange={() => setActiveModelRadio('B')}
                      className="accent-[#F39C2B] w-3 h-3"
                    />
                    <span className="w-4 text-[11px] text-[#B0B0B0]">B:</span>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb.b}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                        updateFromRgb({ ...rgb, b: val });
                      }}
                      className="w-14 bg-[#1E1E1E] border border-[#4A4A4A] text-white px-1.5 py-0.5 rounded text-right text-xs font-mono focus:border-[#F39C2B] focus:outline-none"
                    />
                  </label>
                </div>

                {/* Hex Code Input Bar */}
                <div className="col-span-2 pt-2 border-t border-[#404040] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#CCCCCC] text-sm">#</span>
                    <input
                      type="text"
                      maxLength={6}
                      value={hexInput}
                      onChange={(e) => updateFromHex(e.target.value)}
                      placeholder="F39C2B"
                      className="w-24 bg-[#1E1E1E] border border-[#555] text-white font-mono px-2 py-0.5 rounded text-xs tracking-wider uppercase focus:border-[#F39C2B] focus:outline-none"
                    />
                  </div>

                  {/* CMYK readout */}
                  <div className="text-[10px] text-[#8F8F8F] font-mono flex gap-2">
                    <span>C:{cmyk.c}%</span>
                    <span>M:{cmyk.m}%</span>
                    <span>Y:{cmyk.y}%</span>
                    <span>K:{cmyk.k}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Options: Web colors checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#BBBBBB] hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={onlyWebColors}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setOnlyWebColors(checked);
                      if (checked) {
                        updateFromRgb(rgb, true);
                      }
                    }}
                    className="accent-[#F39C2B] w-3.5 h-3.5 rounded"
                  />
                  <span>Only Web Colors</span>
                </label>
              </div>
            </div>
          </div>

          {/* Collapsible Curated Theme Swatches Palette */}
          {showSwatches && (
            <div className="mt-2 pt-3 border-t border-[#4A4A4A] animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#CCC]">Popular Color Swatches:</span>
                <span className="text-[10px] text-[#888]">Click any preset to select</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = selectedHex.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => updateFromHex(preset.hex)}
                      className={`h-7 rounded border transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-white scale-110 z-10 shadow-lg ring-1 ring-white'
                          : 'border-[#222] hover:scale-105 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={`${preset.name} (${preset.hex})`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
