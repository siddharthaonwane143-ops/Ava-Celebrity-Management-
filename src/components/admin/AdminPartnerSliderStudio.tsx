import React, { useState } from 'react';
import { PartnerProfile, SponsorProfile, SiteSettings, PartnerSliderSettings } from '../../types';
import { saveSiteSettings, savePartnerProfile, deletePartnerProfile } from '../../services/dbService';
import {
  Sparkles,
  Save,
  Eye,
  Sliders,
  Play,
  RotateCw,
  Palette,
  Type,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Award,
  Upload
} from 'lucide-react';
import { PartnersGrid } from '../home/PartnersGrid';

interface AdminPartnerSliderStudioProps {
  siteSettings: SiteSettings | null;
  partners: PartnerProfile[];
  sponsors: SponsorProfile[];
  onDataChange: () => void;
  setNotice: (msg: string) => void;
  setError: (msg: string) => void;
}

export const AdminPartnerSliderStudio: React.FC<AdminPartnerSliderStudioProps> = ({
  siteSettings,
  partners,
  sponsors,
  onDataChange,
  setNotice,
  setError,
}) => {
  const defaultSettings: PartnerSliderSettings = {
    sectionTitle: 'Official Partners & Event Sponsors',
    badgeText: 'Official Ecosystem & Alliances',
    subtitle:
      'World-class OTT streaming networks, film production houses, cinematography units, luxury brand sponsors, and certified stage venues collaborating with AVA.',
    autoSlideSpeed: 'normal',
    slideDirection: 'dual',
    animationStyle: 'continuous_marquee',
    designTheme: 'gold_luxury',
    enableReverseTrack: true,
    enableCategoryTabs: true,
    enableHoverPause: true,
    enableBannerSlide: true,
    cardSize: 'standard',
  };

  const [sliderConfig, setSliderConfig] = useState<PartnerSliderSettings>({
    ...defaultSettings,
    ...(siteSettings?.partnerSliderSettings || {}),
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'customizer' | 'preview' | 'manageLogos'>('customizer');

  // Quick partner creation modal state inside studio
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<PartnerProfile>>({
    name: '',
    partnerType: 'Streaming & Digital OTT Partner',
    partnerTypeSlug: 'ott-streaming-partners',
    partnershipTier: 'Official Partner',
    logoUrl: '',
    description: 'Authorized streaming & digital entertainment partner.',
    website: '',
    city: 'Mumbai',
    isPublished: true,
    isFeatured: true,
  });

  // Handle saving slider settings
  const handleSaveSliderSettings = async () => {
    setSaving(true);
    try {
      if (!siteSettings) return;
      const updatedSiteSettings: SiteSettings = {
        ...siteSettings,
        partnerSliderSettings: sliderConfig,
      };

      await saveSiteSettings(updatedSiteSettings);
      setNotice('Logo Auto-Slide Settings & Design Saved Successfully! Immediately Live on Website (लाईव्ह अपडेट झाले आहे!).');
      onDataChange();
    } catch (err: any) {
      setError(err.message || 'Failed to save slider settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle adding new partner logo
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name?.trim()) {
      setError('Please provide partner name.');
      return;
    }

    try {
      await savePartnerProfile({
        ...newPartner,
        displayOrder: partners.length + 1,
      });
      setNotice(`Partner "${newPartner.name}" added to Auto-Slide network.`);
      setIsAddingPartner(false);
      setNewPartner({
        name: '',
        partnerType: 'Streaming & Digital OTT Partner',
        partnerTypeSlug: 'ott-streaming-partners',
        partnershipTier: 'Official Partner',
        logoUrl: '',
        description: 'Authorized streaming & digital entertainment partner.',
        website: '',
        city: 'Mumbai',
        isPublished: true,
        isFeatured: true,
      });
      onDataChange();
    } catch (err: any) {
      setError(err.message || 'Failed to add partner');
    }
  };

  // Handle logo image file upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPartner((prev) => ({ ...prev, logoUrl: reader.result as string }));
        setNotice('Logo image loaded into form.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#170E1A] via-[#101016] to-[#1C1408] border border-[#D4AF37]/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Sparkles className="w-5 h-5 text-[#F3D068] animate-pulse" />
          </div>
          <div>
            <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Logo Auto-Slide Studio (लोगो ऑटो स्लाईड स्टुडिओ)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono">
                LIVE WORKING
              </span>
            </h2>
            <p className="text-gray-400 text-xs mt-0.5 font-light">
              Full control over auto-slide speed, directions, section typography, themes, and instant viewer updates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab(activeTab === 'preview' ? 'customizer' : 'preview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-purple-950/80 text-purple-200 border-purple-400/50 shadow'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
          >
            <Eye className="w-4 h-4 text-[#D4AF37]" />
            <span>{activeTab === 'preview' ? 'Back to Editor' : 'Live Preview (प्रिव्ह्यू)'}</span>
          </button>

          <button
            onClick={handleSaveSliderSettings}
            disabled={saving}
            className="btn-gold px-5 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <Save className="w-4 h-4 text-black" />
            <span>{saving ? 'Saving...' : 'Save All Settings (बदल सेव्ह करा)'}</span>
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('customizer')}
          className={`px-4 py-2 rounded-lg text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'customizer'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Animation & Design Customizer (डिझाईन व ॲनिमेशन)</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-lg text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Viewer Screen Preview (लाईव्ह स्क्रीन)</span>
        </button>

        <button
          onClick={() => setActiveTab('manageLogos')}
          className={`px-4 py-2 rounded-lg text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'manageLogos'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Add & Manage Partner Logos (लोगो व्यवस्थापन)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ANIMATION & DESIGN CUSTOMIZER */}
      {/* ============================================================== */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Titles, Typography & Content */}
          <div className="card-luxury rounded-2xl p-6 border-gold-glow bg-[#0E0E14] space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-[#D4AF37] flex items-center gap-2 border-b border-white/10 pb-2.5">
              <Type className="w-4 h-4" />
              <span>1. Section Titles & Typography (शीर्षक व मजकूर)</span>
            </h3>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Badge Text (वरचा छोटा बॅज मजकूर) *
              </label>
              <input
                type="text"
                value={sliderConfig.badgeText}
                onChange={(e) => setSliderConfig({ ...sliderConfig, badgeText: e.target.value })}
                placeholder="e.g. Official Ecosystem & Alliances"
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Main Section Title (मुख्य शीर्षक) *
              </label>
              <input
                type="text"
                value={sliderConfig.sectionTitle}
                onChange={(e) => setSliderConfig({ ...sliderConfig, sectionTitle: e.target.value })}
                placeholder="e.g. Official Partners & Event Sponsors"
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37] outline-none font-cinzel font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Subtitle / Description (माहिती व वर्णन) *
              </label>
              <textarea
                rows={3}
                value={sliderConfig.subtitle}
                onChange={(e) => setSliderConfig({ ...sliderConfig, subtitle: e.target.value })}
                placeholder="Detailed description of authorized partners and media networks..."
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            {/* Quick Typography Preset Buttons */}
            <div className="pt-2">
              <span className="text-[11px] text-gray-400 block mb-1.5 font-mono">Quick Title Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Official Partners & Event Sponsors',
                  'Exclusive Brand Sponsors & OTT Networks',
                  'Premier Film Production & Media Alliances',
                  'Global Entertainment Partners & Venues',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSliderConfig({ ...sliderConfig, sectionTitle: preset })}
                    className="text-[10px] font-cinzel px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#F3D068] border border-white/10 transition cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Animation Engine & Speed Settings */}
          <div className="card-luxury rounded-2xl p-6 border-gold-glow bg-[#0E0E14] space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-[#D4AF37] flex items-center gap-2 border-b border-white/10 pb-2.5">
              <RotateCw className="w-4 h-4" />
              <span>2. Auto-Slide Animation Settings (ऑटो-स्लाईड गती व ॲनिमेशन)</span>
            </h3>

            {/* Slide Speed */}
            <div>
              <label className="text-xs text-gray-300 block mb-1.5 font-semibold">
                Slide Speed (स्लाईड फिरण्याचा वेग)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fast', label: 'Fast (झटपट)', desc: '18s marquee / 2.2s banner' },
                  { id: 'normal', label: 'Normal (मध्यम)', desc: '30s marquee / 3.5s banner' },
                  { id: 'slow', label: 'Slow (शांत)', desc: '48s marquee / 5.0s banner' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSliderConfig({ ...sliderConfig, autoSlideSpeed: sp.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      sliderConfig.autoSlideSpeed === sp.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow'
                        : 'bg-[#181822] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-cinzel font-bold text-xs block text-[#F3D068]">{sp.label}</span>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{sp.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slide Direction */}
            <div>
              <label className="text-xs text-gray-300 block mb-1.5 font-semibold">
                Slide Direction & Motion (फिरण्याची दिशा)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dual', label: 'Dual Synchronized', desc: '२ ट्रॅक दोन्ही दिशांनी' },
                  { id: 'rtl', label: 'Right-to-Left', desc: 'उजवीकडून डावीकडे' },
                  { id: 'ltr', label: 'Left-to-Right', desc: 'डावीकडून उजवीकडे' },
                ].map((dir) => (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => setSliderConfig({ ...sliderConfig, slideDirection: dir.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      sliderConfig.slideDirection === dir.id
                        ? 'bg-purple-950/60 border-purple-400 text-purple-200 shadow'
                        : 'bg-[#181822] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-cinzel font-bold text-xs block">{dir.label}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{dir.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Design Theme */}
            <div>
              <label className="text-xs text-gray-300 block mb-1.5 font-semibold">
                Visual Card Design Theme (रंग व डिझाईन थीम)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gold_luxury', label: 'Gold Luxury', desc: 'सोन्याची लक्झरी शाइन' },
                  { id: 'dark_velvet', label: 'Dark Velvet', desc: 'डार्क मखमली ओबसिडियन' },
                  { id: 'cyber_minimal', label: 'Cyber Minimal', desc: 'सिल्व्हर व मिनिमल' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSliderConfig({ ...sliderConfig, designTheme: th.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      sliderConfig.designTheme === th.id
                        ? 'bg-amber-950/60 border-[#D4AF37] text-white shadow'
                        : 'bg-[#181822] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-cinzel font-bold text-xs block text-[#F3D068]">{th.label}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{th.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <span className="text-xs text-gray-200 font-medium">
                  Enable Dual Reverse Track (२रा रिव्हर्स ट्रॅक दाखवा)
                </span>
                <input
                  type="checkbox"
                  checked={sliderConfig.enableReverseTrack}
                  onChange={(e) => setSliderConfig({ ...sliderConfig, enableReverseTrack: e.target.checked })}
                  className="rounded text-[#D4AF37] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <span className="text-xs text-gray-200 font-medium">
                  Enable Category Filter Tabs (कॅटेगरी टॅब्स दाखवा)
                </span>
                <input
                  type="checkbox"
                  checked={sliderConfig.enableCategoryTabs}
                  onChange={(e) => setSliderConfig({ ...sliderConfig, enableCategoryTabs: e.target.checked })}
                  className="rounded text-[#D4AF37] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <span className="text-xs text-gray-200 font-medium">
                  Enable Auto-Slide Featured Banner (वरचा मोठा फिचर्ड बॅनर स्लाईडर)
                </span>
                <input
                  type="checkbox"
                  checked={sliderConfig.enableBannerSlide}
                  onChange={(e) => setSliderConfig({ ...sliderConfig, enableBannerSlide: e.target.checked })}
                  className="rounded text-[#D4AF37] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LIVE VIEWER SCREEN PREVIEW */}
      {/* ============================================================== */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-400/40 text-purple-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-300" />
              <span>
                <strong>Live Interactive Viewer Preview:</strong> This is exactly how the section appears to users on the homepage.
              </span>
            </div>
            <button
              onClick={handleSaveSliderSettings}
              disabled={saving}
              className="btn-gold px-3.5 py-1 rounded-lg text-xs font-cinzel font-bold text-black cursor-pointer shadow"
            >
              {saving ? 'Saving...' : 'Save & Publish Live'}
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#D4AF37]/50 overflow-hidden shadow-2xl bg-[#08080C]">
            <PartnersGrid
              partners={partners}
              sponsors={sponsors}
              onOpenBooking={(type) => setNotice(`Test Booking triggered for: ${type}`)}
              sliderSettings={sliderConfig}
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ADD & MANAGE PARTNER LOGOS */}
      {/* ============================================================== */}
      {activeTab === 'manageLogos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">
                Official Partner & Sponsor Logos ({partners.length + sponsors.length} Total)
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                Add official brand crests, OTT networks, production houses, and event sponsors.
              </p>
            </div>

            <button
              onClick={() => setIsAddingPartner(true)}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add New Partner Logo (नवीन लोगो जोडा)</span>
            </button>
          </div>

          {/* Add Partner Form Modal / Drawer */}
          {isAddingPartner && (
            <form onSubmit={handleCreatePartner} className="card-luxury rounded-2xl p-6 border-gold-glow bg-[#101016] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-cinzel text-base font-bold text-[#F3D068]">
                  Add Official Partner or Sponsor
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingPartner(false)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Entity / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    placeholder="e.g. JioHotstar OTT / Rolex"
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Partner Type / Category</label>
                  <select
                    value={newPartner.partnerType}
                    onChange={(e) =>
                      setNewPartner({
                        ...newPartner,
                        partnerType: e.target.value,
                        partnerTypeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      })
                    }
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="Streaming & Digital OTT Partner">Streaming & Digital OTT Partner</option>
                    <option value="Cinematography & Videography">Cinematography & Videography</option>
                    <option value="Film Production & Sound Stage">Film Production & Sound Stage</option>
                    <option value="Haute Couture & Styling">Haute Couture & Styling</option>
                    <option value="Venue & Production Arena">Venue & Production Arena</option>
                    <option value="Luxury Brand Sponsor">Luxury Brand Sponsor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Partnership Tier</label>
                  <select
                    value={newPartner.partnershipTier}
                    onChange={(e) => setNewPartner({ ...newPartner, partnershipTier: e.target.value as any })}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="Official Partner">Official Partner</option>
                    <option value="Technical Partner">Technical Partner</option>
                    <option value="Creative Partner">Creative Partner</option>
                    <option value="Production Partner">Production Partner</option>
                    <option value="Supporting Partner">Supporting Partner</option>
                  </select>
                </div>
              </div>

              {/* Logo URL or File Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Logo URL (or use Upload below)</label>
                  <input
                    type="url"
                    value={newPartner.logoUrl}
                    onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
                    placeholder="https://... logo PNG/SVG URL"
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Upload Logo Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="w-full text-xs text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#F3D068] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Brief Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newPartner.description}
                  onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                  placeholder="Official scope of collaboration..."
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPartner(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2 rounded-lg text-xs font-cinzel font-bold text-black"
                >
                  Save Partner Logo
                </button>
              </div>
            </form>
          )}

          {/* List of Partners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-[#D4AF37]/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded bg-black/60 text-[#F3D068] border border-[#D4AF37]/30">
                      {p.partnershipTier}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Delete partner ${p.name}?`)) {
                          await deletePartnerProfile(p.id);
                          setNotice(`Partner "${p.name}" deleted.`);
                          onDataChange();
                        }
                      }}
                      className="p-1 rounded text-gray-500 hover:text-rose-400 transition"
                      title="Delete Partner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="h-14 flex items-center justify-center my-2 bg-black/40 rounded-lg p-2">
                    {p.logoUrl && p.logoUrl.startsWith('data:image') ? (
                      <img src={p.logoUrl} alt={p.name} className="max-h-12 max-w-[140px] object-contain" />
                    ) : (
                      <span className="font-cinzel text-xs font-bold text-white">{p.name}</span>
                    )}
                  </div>

                  <h5 className="font-cinzel text-xs font-bold text-white mt-1">{p.name}</h5>
                  <p className="text-[10px] text-[#D4AF37] font-medium">{p.partnerType}</p>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                  <span>{p.city || 'Mumbai'}</span>
                  <span className="text-emerald-400 font-mono">● Auto-Sliding Live</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
