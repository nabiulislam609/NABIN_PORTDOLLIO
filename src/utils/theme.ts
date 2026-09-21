// Color conversion and theme management utility

export const DEFAULT_THEME_COLOR = '#06B6D4'; // Classic Cyan

export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

export interface HSB {
  h: number; // 0 - 360
  s: number; // 0 - 100
  b: number; // 0 - 100
}

export interface CMYK {
  c: number; // 0 - 100
  m: number; // 0 - 100
  y: number; // 0 - 100
  k: number; // 0 - 100
}

/**
 * Clean and normalize hex string
 */
export function normalizeHex(hex: string): string {
  let clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length < 6) {
    clean = clean.padEnd(6, '0');
  }
  return '#' + clean.substring(0, 6).toUpperCase();
}

/**
 * Validate 6-digit hex string
 */
export function isValidHex(hex: string): boolean {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

/**
 * Hex to RGB
 */
export function hexToRgb(hex: string): RGB {
  const norm = normalizeHex(hex).slice(1);
  const r = parseInt(norm.substring(0, 2), 16) || 0;
  const g = parseInt(norm.substring(2, 4), 16) || 0;
  const b = parseInt(norm.substring(4, 6), 16) || 0;
  return { r, g, b };
}

/**
 * RGB to Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * RGB to HSB (Hue 0-360, Saturation 0-100%, Brightness 0-100%)
 */
export function rgbToHsb(r: number, g: number, b: number): HSB {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const bright = Math.round(max * 100);

  return { h, s, b: bright };
}

/**
 * HSB to RGB
 */
export function hsbToRgb(h: number, s: number, b: number): RGB {
  const hNorm = (h % 360 + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const bNorm = Math.max(0, Math.min(100, b)) / 100;

  const c = bNorm * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = bNorm - c;

  let r1 = 0, g1 = 0, b1 = 0;
  if (hNorm >= 0 && hNorm < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (hNorm >= 60 && hNorm < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (hNorm >= 120 && hNorm < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (hNorm >= 180 && hNorm < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (hNorm >= 240 && hNorm < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * RGB to CMYK
 */
export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);

  return {
    c: Math.max(0, Math.min(100, c)),
    m: Math.max(0, Math.min(100, m)),
    y: Math.max(0, Math.min(100, y)),
    k: Math.round(k * 100),
  };
}

/**
 * Snap RGB to nearest Web-Safe color (multiples of 51 / 0x33)
 */
export function snapToWebSafe(rgb: RGB): RGB {
  const snap = (v: number) => Math.round(v / 51) * 51;
  return {
    r: snap(rgb.r),
    g: snap(rgb.g),
    b: snap(rgb.b),
  };
}

/**
 * Adjust brightness of hex color by percentage (-100 to 100)
 */
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  const adjust = (v: number) => {
    if (factor > 0) {
      return Math.round(v + (255 - v) * factor);
    } else {
      return Math.round(v * (1 + factor));
    }
  };
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

/**
 * Curated theme presets
 */
export const THEME_PRESETS = [
  { name: 'Cyan Classic', hex: '#06B6D4', category: 'Default' },
  { name: 'Sunset Orange', hex: '#F39C2B', category: 'Warm' },
  { name: 'Emerald Growth', hex: '#10B981', category: 'Fresh' },
  { name: 'Electric Blue', hex: '#3B82F6', category: 'Cool' },
  { name: 'Royal Violet', hex: '#8B5CF6', category: 'Luxury' },
  { name: 'Crimson Flame', hex: '#EF4444', category: 'Bold' },
  { name: 'Golden Amber', hex: '#F59E0B', category: 'Warm' },
  { name: 'Neon Lime', hex: '#84CC16', category: 'Vibrant' },
  { name: 'Hot Fuchsia', hex: '#EC4899', category: 'Punchy' },
  { name: 'Deep Teal', hex: '#14B8A6', category: 'Clean' },
  { name: 'Indigo Aura', hex: '#6366F1', category: 'Modern' },
  { name: 'Coral Sunrise', hex: '#FB7185', category: 'Warm' },
];

/**
 * Apply theme color dynamically to document styles and CSS custom properties
 */
export function applyWebsiteTheme(color: string): void {
  if (typeof document === 'undefined') return;

  const validHex = normalizeHex(color || DEFAULT_THEME_COLOR);
  const rgb = hexToRgb(validHex);
  const hoverHex = adjustBrightness(validHex, 16);
  const activeHex = adjustBrightness(validHex, -14);
  const textContrast = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 160 ? '#070A12' : '#FFFFFF';

  const root = document.documentElement;
  root.style.setProperty('--theme-primary', validHex);
  root.style.setProperty('--theme-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  root.style.setProperty('--theme-primary-hover', hoverHex);
  root.style.setProperty('--theme-primary-active', activeHex);
  root.style.setProperty('--theme-primary-text', textContrast);
  root.style.setProperty('--theme-primary-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`);
  root.style.setProperty('--theme-primary-tint', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
  root.style.setProperty('--theme-primary-soft', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`);
  root.style.setProperty('--theme-primary-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.42)`);
  root.style.setProperty('--theme-primary-gradient', `linear-gradient(135deg, ${validHex} 0%, ${activeHex} 100%)`);
  root.style.setProperty('--theme-button-gradient', `linear-gradient(135deg, ${hoverHex} 0%, ${validHex} 100%)`);
  root.style.setProperty('--theme-hero-glow', `radial-gradient(circle, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04) 50%, transparent 75%)`);

  try {
    localStorage.setItem('portfolio_theme_color', validHex);
  } catch {}
}

/**
 * Retrieve saved theme color or fallback to default
 */
export function getSavedThemeColor(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME_COLOR;
  try {
    const saved = localStorage.getItem('portfolio_theme_color');
    if (saved && isValidHex(saved)) {
      return normalizeHex(saved);
    }
  } catch {}
  return DEFAULT_THEME_COLOR;
}

/**
 * Background Color Management
 */
export const DEFAULT_BACKGROUND_COLOR = '#0A0E1A'; // Deep Cosmic Navy

export interface BgPreset {
  name: string;
  hex: string;
  category: 'Dark' | 'Deep' | 'Light';
}

export const BACKGROUND_COLOR_PRESETS: BgPreset[] = [
  { name: 'Midnight Navy (Default)', hex: '#0A0E1A', category: 'Deep' },
  { name: 'Pitch Black (OLED)', hex: '#000000', category: 'Dark' },
  { name: 'Obsidian Abyss', hex: '#07090E', category: 'Dark' },
  { name: 'Charcoal Studio', hex: '#121418', category: 'Dark' },
  { name: 'Cyber Indigo', hex: '#0B0F24', category: 'Deep' },
  { name: 'Royal Slate', hex: '#0F172A', category: 'Deep' },
  { name: 'Abyss Emerald', hex: '#061410', category: 'Deep' },
  { name: 'Imperial Violet', hex: '#12091D', category: 'Deep' },
  { name: 'Burgundy Noir', hex: '#170910', category: 'Deep' },
  { name: 'Dark Espresso', hex: '#140F0A', category: 'Dark' },
  { name: 'Titanium Gunmetal', hex: '#191C24', category: 'Dark' },
  { name: 'Nordic Slate Light', hex: '#F1F5F9', category: 'Light' },
  { name: 'Minimal Snow Light', hex: '#FAFAFA', category: 'Light' },
  { name: 'Editorial Cream Light', hex: '#F7F4EB', category: 'Light' },
];

/**
 * Apply website background color dynamically to root styles and document body
 */
export function applyWebsiteBackgroundColor(color: string): void {
  if (typeof document === 'undefined') return;

  const validHex = normalizeHex(color || DEFAULT_BACKGROUND_COLOR);
  const rgb = hexToRgb(validHex);
  const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const isLight = luminance >= 140;

  const root = document.documentElement;
  root.style.setProperty('--site-bg', validHex);
  root.style.setProperty('--site-bg-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

  if (isLight) {
    const surface = adjustBrightness(validHex, -5);
    const elevated = adjustBrightness(validHex, -10);
    root.style.setProperty('--site-bg-surface', surface);
    root.style.setProperty('--site-bg-elevated', elevated);
    root.style.setProperty('--site-bg-card', 'rgba(255, 255, 255, 0.92)');
    root.style.setProperty('--site-border', 'rgba(0, 0, 0, 0.12)');
    root.style.setProperty('--site-text-primary', '#0F172A');
    root.style.setProperty('--site-text-secondary', '#334155');
    root.style.setProperty('--site-text-muted', '#64748B');
    root.style.setProperty('--site-navbar-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.92)`);
    root.style.setProperty('--site-footer-bg', validHex);
  } else {
    const surface = adjustBrightness(validHex, 12);
    const elevated = adjustBrightness(validHex, 20);
    root.style.setProperty('--site-bg-surface', surface);
    root.style.setProperty('--site-bg-elevated', elevated);
    root.style.setProperty(
      '--site-bg-card',
      `rgba(${Math.min(255, rgb.r + 14)}, ${Math.min(255, rgb.g + 20)}, ${Math.min(255, rgb.b + 30)}, 0.75)`
    );
    root.style.setProperty('--site-border', 'rgba(184, 198, 220, 0.14)');
    root.style.setProperty('--site-text-primary', '#F2F5FA');
    root.style.setProperty('--site-text-secondary', '#AAB8CE');
    root.style.setProperty('--site-text-muted', '#7E8DA5');
    root.style.setProperty('--site-navbar-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.88)`);
    root.style.setProperty('--site-footer-bg', validHex);
  }

  if (document.body) {
    document.body.style.backgroundColor = validHex;
  }

  try {
    localStorage.setItem('portfolio_bg_color', validHex);
  } catch {}
}

/**
 * Retrieve saved background color or fallback to default
 */
export function getSavedBackgroundColor(): string {
  if (typeof window === 'undefined') return DEFAULT_BACKGROUND_COLOR;
  try {
    const saved = localStorage.getItem('portfolio_bg_color');
    if (saved && isValidHex(saved)) {
      return normalizeHex(saved);
    }
  } catch {}
  return DEFAULT_BACKGROUND_COLOR;
}

/**
 * Reset website background to original default
 */
export function resetWebsiteBackgroundColor(): void {
  applyWebsiteBackgroundColor(DEFAULT_BACKGROUND_COLOR);
}

