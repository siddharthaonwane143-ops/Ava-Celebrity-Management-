import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Palette,
  Sun,
  Shield,
  Layers,
  Check,
  RotateCcw,
  Eye,
  Sliders,
  Type,
  Maximize2,
  Brush,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import {
  ThemeCustomizationSettings,
  ThemePreset,
  GoldGlowIntensity,
  CardBevelStyle,
  AmbientLighting,
  BannerDecoration,
  FontStyle,
  DEFAULT_THEME_SETTINGS
} from '../../types';
import { getThemeSettings, saveThemeSettings } from '../../services/dbService';

interface AdminThemeStudioProps {
  onThemeApplied?: (theme: ThemeCustomizationSettings) => void;
}

export const AdminThemeStudio: React.FC<AdminThemeStudioProps> = ({ onThemeApplied }) => {
  const [theme, setTheme] = useState<ThemeCustomizationSettings>(DEFAULT_THEME_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preset definitions
  const presets: {
    id: ThemePreset;
    name: string;
    marathiName: string;
    description: string;
    goldColor: string;
    bgColor: string;
    accentGlow: string;
    glowIntensity: GoldGlowIntensity;
    bevel: CardBevelStyle;
    lighting: AmbientLighting;
    bannerDec: BannerDecoration;
    font: FontStyle;
  }[] = [
    {
      id: 'royal_gold',
      name: 'Royal 24K Gold & Onyx',
      marathiName: 'शाही २४ कॅरेट सुवर्ण व कृष्णवर्ण',
      description: 'AVA Signature Luxury: Deep onyx black with warm shimmering 24K pure gold bevels and radiant auroral glow.',
      goldColor: '#D4AF37',
      bgColor: '#07070A',
      accentGlow: 'rgba(212, 175, 55, 0.45)',
      glowIntensity: 'vibrant',
      bevel: 'diamond_gold',
      lighting: 'spotlight',
      bannerDec: 'filigree',
      font: 'cinzel_regal',
    },
    {
      id: 'midnight_platinum',
      name: 'Midnight Platinum & Obsidian',
      marathiName: 'मध्यरात्र प्लॅटिनम व ऑब्सिडियन',
      description: 'Ultra-cool haute couture: Obsidian graphite with frosted platinum silver highlights and ice-diamond illumination.',
      goldColor: '#E5E9F0',
      bgColor: '#090B10',
      accentGlow: 'rgba(229, 233, 240, 0.40)',
      glowIntensity: 'vibrant',
      bevel: 'glass_bevel',
      lighting: 'deep_starlight',
      bannerDec: 'modern_sleek',
      font: 'montserrat_modern',
    },
    {
      id: 'velvet_maroon',
      name: 'Velvet Maroon & Vintage Champagne',
      marathiName: 'मखमली मॅरून व व्हिंटेज शॅम्पेन',
      description: 'Regal Bollywood Premiere: Aristocratic deep wine Bordeaux background paired with antique champagne accents.',
      goldColor: '#F3D068',
      bgColor: '#140508',
      accentGlow: 'rgba(243, 208, 104, 0.50)',
      glowIntensity: 'vibrant',
      bevel: 'double_border_royal',
      lighting: 'golden_aurora',
      bannerDec: 'ornate_corners',
      font: 'playfair_classic',
    },
    {
      id: 'dark_noir',
      name: 'Dark Noir Minimalist',
      marathiName: 'डार्क नॉयर मिनिमलिस्ट',
      description: 'Sleek architectural precision: Deep matte black with discreet brass hairlines and high-contrast typography.',
      goldColor: '#C5A059',
      bgColor: '#040405',
      accentGlow: 'rgba(197, 160, 89, 0.25)',
      glowIntensity: 'subtle',
      bevel: 'subtle_hairline',
      lighting: 'pure_minimalist',
      bannerDec: 'modern_sleek',
      font: 'cinzel_regal',
    },
  ];

  useEffect(() => {
    getThemeSettings().then((loaded) => {
      setTheme(loaded);
      setLoading(false);
      applyThemeToDOM(loaded);
    });
  }, []);

  const applyThemeToDOM = (t: ThemeCustomizationSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--ava-gold', t.customGoldColor || '#D4AF37');
    root.style.setProperty('--ava-bg', t.customBackgroundColor || '#07070A');
    root.setAttribute('data-theme-preset', t.preset);
    root.setAttribute('data-theme-glow', t.goldGlowIntensity);
    root.setAttribute('data-theme-bevel', t.cardBevelStyle);
    root.setAttribute('data-theme-lighting', t.ambientLighting);
  };

  const handleSelectPreset = (presetId: ThemePreset) => {
    const found = presets.find((p) => p.id === presetId);
    if (!found) return;

    const updated: ThemeCustomizationSettings = {
      ...theme,
      preset: found.id,
      customGoldColor: found.goldColor,
      customBackgroundColor: found.bgColor,
      goldGlowIntensity: found.glowIntensity,
      cardBevelStyle: found.bevel,
      ambientLighting: found.lighting,
      bannerDecoration: found.bannerDec,
      fontStyle: found.font,
    };
    setTheme(updated);
    applyThemeToDOM(updated);
  };

  const handleUpdate = (partial: Partial<ThemeCustomizationSettings>) => {
    const updated = { ...theme, ...partial };
    setTheme(updated);
    applyThemeToDOM(updated);
  };

  const handleSaveAndApply = async () => {
    setSaving(true);
    try {
      const saved = await saveThemeSettings(theme);
      setTheme(saved);
      applyThemeToDOM(saved);
      if (onThemeApplied) {
        onThemeApplied(saved);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.warn('Save theme error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    setTheme(DEFAULT_THEME_SETTINGS);
    applyThemeToDOM(DEFAULT_THEME_SETTINGS);
    await saveThemeSettings(DEFAULT_THEME_SETTINGS);
    if (onThemeApplied) {
      onThemeApplied(DEFAULT_THEME_SETTINGS);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
        <p className="font-cinzel text-sm">Loading Luxury Design Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#181824] via-[#0E0E17] to-[#12050B] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 uppercase tracking-widest font-bold">
                AVA AESTHETIC ARCHITECTURE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> 100% LIVE ON VIEWER & ADMIN
              </span>
            </div>
            <h2 className="text-2xl font-cinzel font-bold text-white flex items-center gap-2.5">
              <Brush className="w-6 h-6 text-[#D4AF37]" />
              <span>Luxury Design Decoration & Theme Studio (थीम व डेकोरेशन)</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
              Control website visual ambiance, 24K gold illumination, card bevels, ambient spotlighting, and luxury typography across the entire viewer home page and administration portal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleResetToDefault}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20 text-xs font-cinzel transition flex items-center gap-1.5 cursor-pointer"
              title="Reset to default AVA theme"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              onClick={handleSaveAndApply}
              disabled={saving}
              className={`px-5 py-2.5 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#F3D068] to-[#AA7C11] text-black hover:opacity-95 shadow-[#D4AF37]/30'
              }`}
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Syncing Live...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Theme Applied & Saved!</span>
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4 text-black" />
                  <span>Publish Theme Live (थीम सेव्ह करा)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Presets & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 4 Luxury Presets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0E0E14] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-cinzel font-bold text-[#F3D068] flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>1. Curated Luxury Presets (मुख्य रॉयल प्रीसेट्स)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {presets.map((preset) => {
                const isSelected = theme.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-4 rounded-xl text-left transition relative border cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#171724] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                        : 'bg-black/50 border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                            style={{ backgroundColor: preset.goldColor }}
                          />
                          <span className="font-cinzel font-bold text-sm text-white group-hover:text-[#F3D068]">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xs font-bold shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[#D4AF37] mb-1.5">{preset.marathiName}</div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>Bg: {preset.bgColor}</span>
                      <span className="text-[#F3D068]">Accent: {preset.goldColor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Aesthetic Controls */}
          <div className="bg-[#0E0E14] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl space-y-6">
            <h3 className="text-sm font-cinzel font-bold text-[#F3D068] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <span>2. Fine-Tuned Illumination & Decoration Controls (विशिष्ट डेकोरेशन सेटिंग्ज)</span>
            </h3>

            {/* Gold Glow Intensity */}
            <div className="space-y-2">
              <label className="text-xs font-cinzel font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Gold Glow Intensity (सुवर्ण प्रकाशाची तीव्रता)</span>
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{theme.goldGlowIntensity}</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'subtle', label: 'Subtle Chic', desc: 'Discreet High-Fashion' },
                  { id: 'vibrant', label: 'Vibrant Luxury', desc: 'Signature 24K Radiance' },
                  { id: 'neon', label: 'Neon High-Impact', desc: 'Red Carpet Gala Max' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdate({ goldGlowIntensity: item.id as GoldGlowIntensity })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      theme.goldGlowIntensity === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-cinzel">{item.label}</div>
                    <div className="text-[10px] text-gray-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Bevel & Border Styling */}
            <div className="space-y-2">
              <label className="text-xs font-cinzel font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Card Bevel & Border Style (कार्ड बॉर्डर व कोनांची रचना)</span>
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{theme.cardBevelStyle}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'diamond_gold', label: 'Diamond Gold', desc: 'Beveled 24K Gold' },
                  { id: 'subtle_hairline', label: 'Hairline Minimal', desc: '0.5px Pure Line' },
                  { id: 'double_border_royal', label: 'Double Royal', desc: 'Dual Layer Frame' },
                  { id: 'glass_bevel', label: 'Glass Bevel', desc: 'Frosted Rim' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdate({ cardBevelStyle: item.id as CardBevelStyle })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      theme.cardBevelStyle === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-cinzel">{item.label}</div>
                    <div className="text-[9px] text-gray-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Background Lighting */}
            <div className="space-y-2">
              <label className="text-xs font-cinzel font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Ambient Background Lighting (पार्श्वभूमीचा प्रकाश व ऑरा)</span>
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{theme.ambientLighting}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'spotlight', label: 'Radial Spotlight', desc: 'Overhead VIP Beam' },
                  { id: 'golden_aurora', label: 'Golden Aurora', desc: 'Warm Dual Wash' },
                  { id: 'deep_starlight', label: 'Deep Starlight', desc: 'Subtle Shimmer' },
                  { id: 'pure_minimalist', label: 'Ultra Dark', desc: 'Pure Deep Matte' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdate({ ambientLighting: item.id as AmbientLighting })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      theme.ambientLighting === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-cinzel">{item.label}</div>
                    <div className="text-[9px] text-gray-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Gold Palette & Background Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="text-xs font-cinzel font-bold text-gray-300 block mb-1.5">
                  Metallic Accent Color (कस्टम सुवर्ण छटा)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.customGoldColor || '#D4AF37'}
                    onChange={(e) => handleUpdate({ customGoldColor: e.target.value })}
                    className="w-10 h-10 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {['#D4AF37', '#F3D068', '#E5E9F0', '#E0A996', '#C5A059'].map((col) => (
                      <button
                        key={col}
                        onClick={() => handleUpdate({ customGoldColor: col })}
                        className="w-6 h-6 rounded-md border border-white/30 cursor-pointer transition hover:scale-110"
                        style={{ backgroundColor: col }}
                        title={col}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-cinzel font-bold text-gray-300 block mb-1.5">
                  Deep Luxury Background (पार्श्वभूमीचा गडद रंग)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.customBackgroundColor || '#07070A'}
                    onChange={(e) => handleUpdate({ customBackgroundColor: e.target.value })}
                    className="w-10 h-10 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {['#07070A', '#090B10', '#140508', '#040405', '#0E0E14'].map((col) => (
                      <button
                        key={col}
                        onClick={() => handleUpdate({ customBackgroundColor: col })}
                        className="w-6 h-6 rounded-md border border-white/30 cursor-pointer transition hover:scale-110"
                        style={{ backgroundColor: col }}
                        title={col}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Accent */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-cinzel font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Typography Hierarchy Style (फॉन्ट शैली)</span>
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{theme.fontStyle}</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'cinzel_regal', label: 'Cinzel Regal', desc: 'Imperial Classical Serif' },
                  { id: 'playfair_classic', label: 'Playfair Classic', desc: 'Haute Couture Editorial' },
                  { id: 'montserrat_modern', label: 'Montserrat Modern', desc: 'Executive Geometric Sans' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdate({ fontStyle: item.id as FontStyle })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      theme.fontStyle === item.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[9px] text-gray-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview Stage */}
        <div className="space-y-6">
          <div className="bg-[#0E0E14] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-2xl sticky top-20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-cinzel font-bold text-[#F3D068] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span>Live Real-Time Preview (थेट पूर्वावलोकन)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE THEME
              </span>
            </div>

            {/* Mock Artist Profile Card with Chosen Theme */}
            <div
              className="rounded-2xl p-4 transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: theme.customBackgroundColor || '#07070A',
                border: `1px solid ${theme.customGoldColor || '#D4AF37'}55`,
                boxShadow:
                  theme.goldGlowIntensity === 'neon'
                    ? `0 0 25px ${theme.customGoldColor || '#D4AF37'}40`
                    : theme.goldGlowIntensity === 'vibrant'
                    ? `0 0 15px ${theme.customGoldColor || '#D4AF37'}25`
                    : 'none',
              }}
            >
              {/* Card Ambient Highlight */}
              {theme.ambientLighting === 'spotlight' && (
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-2xl pointer-events-none"
                  style={{ backgroundColor: `${theme.customGoldColor || '#D4AF37'}20` }}
                />
              )}
              {theme.ambientLighting === 'golden_aurora' && (
                <div
                  className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none"
                  style={{ backgroundColor: `${theme.customGoldColor || '#D4AF37'}25` }}
                />
              )}

              <div className="relative z-10 space-y-3">
                {/* Profile Avatar & Badges */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl border flex items-center justify-center font-cinzel font-bold text-lg shadow-md"
                    style={{
                      borderColor: theme.customGoldColor || '#D4AF37',
                      color: theme.customGoldColor || '#D4AF37',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    AVA
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-cinzel font-bold text-sm text-white">Devansh Malhotra</span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold"
                        style={{
                          borderColor: theme.customGoldColor || '#D4AF37',
                          color: theme.customGoldColor || '#D4AF37',
                          backgroundColor: `${theme.customGoldColor || '#D4AF37'}15`,
                        }}
                      >
                        A-LIST LEAD
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">Hindi Cinema & Marathi Natak</div>
                    <div className="text-[10px] text-gray-400">Mumbai / Maharashtra</div>
                  </div>
                </div>

                {/* Beveled Quote Block */}
                <div
                  className="p-3 rounded-xl text-xs text-gray-300 leading-relaxed border"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    borderColor: `${theme.customGoldColor || '#D4AF37'}30`,
                  }}
                >
                  "Excellence isn't an accident — under AVA Celebrity Management, our craft reaches premier stages and national screens."
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    className="flex-1 py-2 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition shadow-md"
                    style={{
                      backgroundColor: theme.customGoldColor || '#D4AF37',
                      color: '#000000',
                      boxShadow: `0 4px 14px ${theme.customGoldColor || '#D4AF37'}40`,
                    }}
                  >
                    Direct VIP Booking
                  </button>
                  <button
                    className="px-3 py-2 rounded-xl text-xs font-cinzel border transition"
                    style={{
                      borderColor: `${theme.customGoldColor || '#D4AF37'}60`,
                      color: theme.customGoldColor || '#D4AF37',
                    }}
                  >
                    Showreel
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Live Apply Button */}
            <div className="mt-5">
              <button
                onClick={handleSaveAndApply}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D068] to-[#AA7C11] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:opacity-95 transition shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>Synchronizing Site...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-black" />
                    <span>Apply Live to Home & Portal</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-400 mt-2 font-mono">
                Changes persist universally across all viewer sessions & link reloads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
