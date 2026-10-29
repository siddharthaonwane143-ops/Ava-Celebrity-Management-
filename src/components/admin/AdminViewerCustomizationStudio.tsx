import React, { useState } from 'react';
import {
  SiteSettings,
  ViewerFeatureCustomization
} from '../../types';
import { saveSiteSettings } from '../../services/dbService';
import {
  Sliders,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Video,
  Award,
  Cpu,
  MessageSquare,
  FileSpreadsheet,
  FileText,
  Save,
  AlertCircle,
  ExternalLink,
  Volume2,
  BadgeAlert,
  HelpCircle,
  Film
} from 'lucide-react';

interface AdminViewerCustomizationStudioProps {
  siteSettings: SiteSettings;
  onSettingsUpdated: () => void;
  setNotice: (msg: string | null) => void;
  setError: (msg: string | null) => void;
  onPreviewLive?: () => void;
}

export const AdminViewerCustomizationStudio: React.FC<AdminViewerCustomizationStudioProps> = ({
  siteSettings,
  onSettingsUpdated,
  setNotice,
  setError,
  onPreviewLive
}) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'header' | 'notice' | 'profile' | 'hero' | 'booking'>('sections');
  const [saving, setSaving] = useState(false);

  // Local state initialized with current siteSettings
  const [features, setFeatures] = useState<ViewerFeatureCustomization>({
    enableNoticeTicker: siteSettings.viewerFeatures?.enableNoticeTicker ?? true,
    noticeTickerText: siteSettings.viewerFeatures?.noticeTickerText ?? 'मराठी सिनेसृष्टी व बॉलीवूडचे नामवंत सेलिब्रिटी थेट बुकिंगसाठी उपलब्ध! • 100% Verified Talents & Official Digital Passes',
    noticeTickerBadge: siteSettings.viewerFeatures?.noticeTickerBadge ?? 'VIP ANNOUNCEMENT',
    noticeTickerTheme: siteSettings.viewerFeatures?.noticeTickerTheme ?? 'gold',
    noticeTickerLink: siteSettings.viewerFeatures?.noticeTickerLink ?? '',

    showHeroBanner: siteSettings.viewerFeatures?.showHeroBanner ?? true,
    showCommandHubThreeLines: siteSettings.viewerFeatures?.showCommandHubThreeLines ?? true,
    showMarketingBanners: siteSettings.viewerFeatures?.showMarketingBanners ?? true,
    showEventFestivalVideos: siteSettings.viewerFeatures?.showEventFestivalVideos ?? true,
    showVIPRoster: siteSettings.viewerFeatures?.showVIPRoster ?? true,
    showUpcomingShows: siteSettings.viewerFeatures?.showUpcomingShows ?? true,
    showPartnersGrid: siteSettings.viewerFeatures?.showPartnersGrid ?? true,
    showAIToolsSuite: siteSettings.viewerFeatures?.showAIToolsSuite ?? true,
    showTestimonials: siteSettings.viewerFeatures?.showTestimonials ?? true,
    showTeamContact: siteSettings.viewerFeatures?.showTeamContact ?? true,

    showSearchBar: siteSettings.viewerFeatures?.showSearchBar ?? true,
    showAISearchButton: siteSettings.viewerFeatures?.showAISearchButton ?? true,
    showVoiceGuideButton: siteSettings.viewerFeatures?.showVoiceGuideButton ?? true,
    showFloatingWhatsApp: siteSettings.viewerFeatures?.showFloatingWhatsApp ?? true,
    whatsAppNumber: siteSettings.viewerFeatures?.whatsAppNumber ?? '+91 98200 12345',
    whatsAppDefaultMessage: siteSettings.viewerFeatures?.whatsAppDefaultMessage ?? 'नमस्ते AVA Celebrity Management! मला कलाकार व शोज बुकिंग संदर्भात अधिक माहिती हवी आहे.',
    showMobileBottomNav: siteSettings.viewerFeatures?.showMobileBottomNav ?? true,

    allowViewerProfileEdit: siteSettings.viewerFeatures?.allowViewerProfileEdit ?? true,
    requirePhoneVerification: siteSettings.viewerFeatures?.requirePhoneVerification ?? false,
    allowViewerIdUpload: siteSettings.viewerFeatures?.allowViewerIdUpload ?? true,
    showVerifiedViewerBadge: siteSettings.viewerFeatures?.showVerifiedViewerBadge ?? true,
    viewerWelcomeNote: siteSettings.viewerFeatures?.viewerWelcomeNote ?? 'आपले अधिकृत व्हीआयपी प्रोफाईल कस्टमायझेशन व पडताळणी केंद्र',

    allowInstantBooking: siteSettings.viewerFeatures?.allowInstantBooking ?? true,
    allowPdfPassDownload: siteSettings.viewerFeatures?.allowPdfPassDownload ?? true,
    showDirectCallButton: siteSettings.viewerFeatures?.showDirectCallButton ?? true,
    currencyDisplay: siteSettings.viewerFeatures?.currencyDisplay ?? 'INR',

    heroBadgeText: siteSettings.viewerFeatures?.heroBadgeText ?? "MAHARASHTRA'S PREMIER TALENT ROSTER",
    heroHeadline: siteSettings.viewerFeatures?.heroHeadline ?? siteSettings.heroHeadline ?? 'Building Stars. Creating Legacies.',
    heroSubtitle: siteSettings.viewerFeatures?.heroSubtitle ?? siteSettings.heroSubtitle ?? 'The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators.',
    heroPrimaryBtnText: siteSettings.viewerFeatures?.heroPrimaryBtnText ?? 'Explore 500+ Talents (कलाकार शोधा)',
    heroSecondaryBtnText: siteSettings.viewerFeatures?.heroSecondaryBtnText ?? 'Direct Celebrity Booking (थेट बुकिंग करा)',
    heroShowsBtnText: siteSettings.viewerFeatures?.heroShowsBtnText ?? 'Upcoming Shows & Passes (आगामी शोज)',

    talentShowcaseTitle: siteSettings.viewerFeatures?.talentShowcaseTitle ?? 'Official VIP Celebrity & Talent Roster',
    talentShowcaseSubtitle: siteSettings.viewerFeatures?.talentShowcaseSubtitle ?? "Direct VIP bookings for India's leading cinematic actors, playback vocalists, international fashion supermodels, prime-time gala hosts, official media partners, and title sponsors.",
    talentShowcaseBadge: siteSettings.viewerFeatures?.talentShowcaseBadge ?? 'Exclusive Agency Ecosystem',
  });

  const handleToggle = (key: keyof ViewerFeatureCustomization) => {
    setFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedSiteSettings: Partial<SiteSettings> = {
        ...siteSettings,
        viewerFeatures: features,
        heroHeadline: features.heroHeadline || siteSettings.heroHeadline,
        heroSubtitle: features.heroSubtitle || siteSettings.heroSubtitle,
      };

      await saveSiteSettings(updatedSiteSettings);
      localStorage.setItem('ava_viewer_features', JSON.stringify(features));
      setNotice('✅ Viewer Panel All Features Customization saved successfully! Changes are live on the website.');
      onSettingsUpdated();
    } catch (err: any) {
      setError(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all viewer panel customization to recommended agency defaults?')) {
      setFeatures({
        enableNoticeTicker: true,
        noticeTickerText: 'मराठी सिनेसृष्टी व बॉलीवूडचे नामवंत सेलिब्रिटी थेट बुकिंगसाठी उपलब्ध! • 100% Verified Talents & Official Digital Passes',
        noticeTickerBadge: 'VIP ANNOUNCEMENT',
        noticeTickerTheme: 'gold',
        noticeTickerLink: '',

        showHeroBanner: true,
        showCommandHubThreeLines: true,
        showMarketingBanners: true,
        showEventFestivalVideos: true,
        showVIPRoster: true,
        showUpcomingShows: true,
        showPartnersGrid: true,
        showAIToolsSuite: true,
        showTestimonials: true,
        showTeamContact: true,

        showSearchBar: true,
        showAISearchButton: true,
        showVoiceGuideButton: true,
        showFloatingWhatsApp: true,
        whatsAppNumber: '+91 98200 12345',
        whatsAppDefaultMessage: 'नमस्ते AVA Celebrity Management! मला कलाकार व शोज बुकिंग संदर्भात अधिक माहिती हवी आहे.',
        showMobileBottomNav: true,

        allowViewerProfileEdit: true,
        requirePhoneVerification: false,
        allowViewerIdUpload: true,
        showVerifiedViewerBadge: true,
        viewerWelcomeNote: 'आपले अधिकृत व्हीआयपी प्रोफाईल कस्टमायझेशन व पडताळणी केंद्र',

        allowInstantBooking: true,
        allowPdfPassDownload: true,
        showDirectCallButton: true,
        currencyDisplay: 'INR',

        heroBadgeText: "MAHARASHTRA'S PREMIER TALENT ROSTER",
        heroHeadline: 'Building Stars. Creating Legacies.',
        heroSubtitle: 'The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators.',
        heroPrimaryBtnText: 'Explore 500+ Talents (कलाकार शोधा)',
        heroSecondaryBtnText: 'Direct Celebrity Booking (थेट बुकिंग करा)',
        heroShowsBtnText: 'Upcoming Shows & Passes (आगामी शोज)',
      });
      setNotice('Reset to recommended defaults. Click "Save & Publish Changes" to apply.');
    }
  };

  const handleEnableAllSections = () => {
    setFeatures(prev => ({
      ...prev,
      showHeroBanner: true,
      showCommandHubThreeLines: true,
      showMarketingBanners: true,
      showEventFestivalVideos: true,
      showVIPRoster: true,
      showUpcomingShows: true,
      showPartnersGrid: true,
      showAIToolsSuite: true,
      showTestimonials: true,
      showTeamContact: true,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1E1208] via-[#120C18] to-[#0A0A10] border border-[#D4AF37]/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-1">
            <Sliders className="w-4 h-4 text-[#D4AF37]" />
            <span>Master Viewer Panel Studio • व्ह्यूवर पॅनेल ऑल फीचर्स कस्टमायझेशन</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <span>Viewer Panel All Features Customization</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              Live Control
            </span>
          </h2>
          <p className="text-gray-300 text-xs mt-1 max-w-2xl">
            व्ह्यूवर पोर्टलचे सर्व फीचर्स (होमपेज सेक्शन्स, लाईव्ह टिकर, नेव्हिगेशन, व्ह्यूवर प्रोफाईल एडिट, व्हॉट्सअ‍ॅप डेस्क, बुकिंग पर्याय) येथे कस्टमायझ करा.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onPreviewLive && (
            <button
              onClick={onPreviewLive}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live on Site</span>
            </button>
          )}

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Reset to recommended agency defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3D068] hover:brightness-110 text-black font-cinzel font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition cursor-pointer disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save & Publish (बदल सेव्ह करा)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-2 scrollbar-none">
        {[
          { id: 'sections', label: '1. Homepage Sections (होमपेज विभाग)', icon: Layers },
          { id: 'notice', label: '2. Top Notice Ticker (लाईव्ह सूचना पट्टी)', icon: BadgeAlert },
          { id: 'header', label: '3. Header & WhatsApp (नेव्हिगेशन व डेस्क)', icon: MessageCircle },
          { id: 'profile', label: '4. Viewer Profile & Verify (प्रोफाईल नियम)', icon: ShieldCheck },
          { id: 'hero', label: '5. Hero Banner Headlines (मुख्य बॅनर मजकूर)', icon: Film },
          { id: 'booking', label: '6. Booking & Passes (बुकिंग व पासेस)', icon: Calendar },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-[#121218] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HOMEPAGE SECTIONS */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#14141E] border border-white/10">
            <div>
              <h3 className="font-cinzel text-sm font-bold text-white">Homepage Sections Visibility Manager</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Turn specific frontend sections ON or OFF instantly based on marketing focus or seasonal promotions.
              </p>
            </div>
            <button
              onClick={handleEnableAllSections}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/25 transition cursor-pointer"
            >
              Enable All Sections (सर्व चालू करा)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section Item */}
            {[
              {
                key: 'showHeroBanner' as const,
                title: 'Cinematic Hero Banner (मुख्य बॅनर)',
                desc: 'Main visual carousel with primary CTA buttons and verified monogram badge.',
                icon: Film,
                badge: 'Primary Anchor'
              },
              {
                key: 'showCommandHubThreeLines' as const,
                title: '3-Tier Command Hub (बुकिंग, प्रोफाईल्स व प्रॉडक्शन)',
                desc: '3-panel quick action hub for Customer Booking, Artist Roster, and Production unit.',
                icon: Sliders,
                badge: 'Workflow Hub'
              },
              {
                key: 'showMarketingBanners' as const,
                title: 'Marketing Campaign Banners Showcase',
                desc: 'Admin controlled promotional campaign carousel and spotlight banners.',
                icon: Sparkles,
                badge: 'Campaigns'
              },
              {
                key: 'showEventFestivalVideos' as const,
                title: 'Event & Festival Long Video Showcase (व्हिडिओ शोकेस)',
                desc: 'Exclusive vertical 9:16 reels and 16:9 widescreen stage event videos.',
                icon: Video,
                badge: 'Video Media'
              },
              {
                key: 'showVIPRoster' as const,
                title: 'Official VIP Celebrity & Talent Profile Showcase (टॅलेंट प्रोफाईल शोकेस)',
                desc: 'Admin decides whether to showcase or hide Talent Profiles on homepage. Custom title & subtitle available in Tab 5.',
                icon: Users,
                badge: 'Admin Controlled'
              },
              {
                key: 'showUpcomingShows' as const,
                title: 'Upcoming Events & Talent Shows Section (आगामी शोज)',
                desc: 'Show schedules across Maharashtra cities with digital PDF pass registration.',
                icon: Calendar,
                badge: 'Ticketed Shows'
              },
              {
                key: 'showPartnersGrid' as const,
                title: 'Official Partners & Sponsors Prestige Pavilion (पार्टनर्स)',
                desc: 'Auto-scrolling logo showcase featuring OTT networks, film studios, and sponsors with City filter.',
                icon: Award,
                badge: 'Ecosystem'
              },
              {
                key: 'showTeamContact' as const,
                title: 'Executive Team Contact Section & Google Sheets Desk',
                desc: 'Direct executive booking desks with real Google Sheets ingestion and PDF dossier.',
                icon: FileSpreadsheet,
                badge: 'Direct Desk'
              },
            ].map(sec => {
              const Icon = sec.icon;
              const isEnabled = features[sec.key] ?? true;
              return (
                <div
                  key={sec.key}
                  className={`p-4 rounded-xl border transition-all ${
                    isEnabled
                      ? 'bg-[#12121A] border-[#D4AF37]/30 shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                      : 'bg-[#0E0E14]/60 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg shrink-0 ${isEnabled ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-gray-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                            {sec.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                          {sec.desc}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(sec.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-[#D4AF37]' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Status on Viewer Website:</span>
                    <span className={isEnabled ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                      {isEnabled ? '● Active / Visible (दिसत आहे)' : '○ Hidden / Inactive (लपवले आहे)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TOP NOTICE TICKER */}
      {activeTab === 'notice' && (
        <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <BadgeAlert className="w-4 h-4 text-[#D4AF37]" />
                <span>Live Announcement & Breaking News Marquee Ticker</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Displays a prominent scrolling news ticker at the very top of the website for all viewers.
              </p>
            </div>
            <button
              onClick={() => handleToggle('enableNoticeTicker')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                features.enableNoticeTicker ? 'bg-[#D4AF37]' : 'bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow transition duration-200 ease-in-out ${
                  features.enableNoticeTicker ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Ticker Badge Label (उदा. VIP ANNOUNCEMENT, ब्रेकिंग न्यूज, थेट संपर्क)
              </label>
              <input
                type="text"
                value={features.noticeTickerBadge || ''}
                onChange={(e) => setFeatures({ ...features, noticeTickerBadge: e.target.value })}
                placeholder="VIP ANNOUNCEMENT"
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Announcement Message (मराठी व इंग्रजी संदेश)
              </label>
              <textarea
                rows={3}
                value={features.noticeTickerText || ''}
                onChange={(e) => setFeatures({ ...features, noticeTickerText: e.target.value })}
                placeholder="मराठी सिनेसृष्टी व बॉलीवूडचे नामवंत सेलिब्रिटी थेट बुकिंगसाठी उपलब्ध! • 100% Verified Talents & Official Digital Passes"
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-semibold">
                  Visual Luxury Theme Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gold', label: 'Royal Gold', color: 'bg-[#D4AF37] text-black' },
                    { id: 'crimson', label: 'Alert Crimson', color: 'bg-rose-500 text-white' },
                    { id: 'violet', label: 'Royal Violet', color: 'bg-purple-600 text-white' },
                    { id: 'emerald', label: 'Emerald Green', color: 'bg-emerald-500 text-black' },
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setFeatures({ ...features, noticeTickerTheme: theme.id as any })}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between cursor-pointer transition ${
                        features.noticeTickerTheme === theme.id
                          ? 'border-[#D4AF37] bg-white/10 text-white ring-1 ring-[#D4AF37]'
                          : 'border-white/5 bg-[#121218] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{theme.label}</span>
                      <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1 font-semibold">
                  Action Link / URL (Optional)
                </label>
                <input
                  type="text"
                  value={features.noticeTickerLink || ''}
                  onChange={(e) => setFeatures({ ...features, noticeTickerLink: e.target.value })}
                  placeholder="https://... किंवा 'booking'"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Tip: Type 'booking' to open the VIP Booking form when clicked, or enter an external URL.
                </span>
              </div>
            </div>

            {/* Live Ticker Preview */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-gray-400 block mb-2 font-mono">Live Ticker Preview:</span>
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#1E1405] via-[#2A1D07] to-[#1E1405] border border-[#D4AF37]/40 flex items-center gap-3 overflow-hidden">
                <span className="px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-bold bg-[#D4AF37] text-black shrink-0">
                  {features.noticeTickerBadge || 'VIP ANNOUNCEMENT'}
                </span>
                <span className="text-xs text-[#F9E29D] truncate">
                  {features.noticeTickerText || 'Notice preview text'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEADER, SEARCH & WHATSAPP */}
      {activeTab === 'header' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Navigation Controls */}
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-5">
            <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>Header Search & AI Feature Buttons</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#14141E] border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">Live Search Bar in Header</div>
                  <div className="text-[11px] text-gray-400">Allows instant search across 500+ Marathi & Indian talents.</div>
                </div>
                <button
                  onClick={() => handleToggle('showSearchBar')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.showSearchBar ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showSearchBar ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#14141E] border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">AI Search & Matchmaker Button</div>
                  <div className="text-[11px] text-gray-400">Shows "AI Search" button next to search bar in top navigation.</div>
                </div>
                <button
                  onClick={() => handleToggle('showAISearchButton')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.showAISearchButton ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showAISearchButton ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#14141E] border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">Marathi Audio Voice Guide Button</div>
                  <div className="text-[11px] text-gray-400">Provides spoken audio guidance in Marathi for users.</div>
                </div>
                <button
                  onClick={() => handleToggle('showVoiceGuideButton')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.showVoiceGuideButton ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showVoiceGuideButton ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#14141E] border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">Mobile Bottom Quick Dock</div>
                  <div className="text-[11px] text-gray-400">Fixed bottom navigation bar on mobile smartphones.</div>
                </div>
                <button
                  onClick={() => handleToggle('showMobileBottomNav')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.showMobileBottomNav ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showMobileBottomNav ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Floating Desk Settings */}
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Floating WhatsApp VIP Desk (थेट व्हॉट्सअ‍ॅप)</span>
              </h3>
              <button
                onClick={() => handleToggle('showFloatingWhatsApp')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  features.showFloatingWhatsApp ? 'bg-[#25D366]' : 'bg-white/10'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showFloatingWhatsApp ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-semibold">
                  Official WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={features.whatsAppNumber || ''}
                  onChange={(e) => setFeatures({ ...features, whatsAppNumber: e.target.value })}
                  placeholder="+91 98200 12345"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1 font-semibold">
                  Default Pre-filled Message (मराठी/इंग्रजी टेक्स्ट)
                </label>
                <textarea
                  rows={3}
                  value={features.whatsAppDefaultMessage || ''}
                  onChange={(e) => setFeatures({ ...features, whatsAppDefaultMessage: e.target.value })}
                  placeholder="नमस्ते AVA Celebrity Management! मला कलाकार व शोज बुकिंग संदर्भात अधिक माहिती हवी आहे."
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0B150E] border border-[#25D366]/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-black fill-black" />
                </div>
                <div className="text-[11px] text-gray-300">
                  व्ह्यूवर थेट स्क्रीनच्या कोपऱ्यातील व्हॉट्सअ‍ॅप बटनावर क्लिक करून या नंबरवर चॅट सुरू करू शकतात.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VIEWER PROFILE & VERIFICATION */}
      {activeTab === 'profile' && (
        <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-6">
          <div>
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Viewer Profile Customization & Real Verification Controls</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Configure viewer profile editing permissions, OTP phone verification requirements, and Aadhaar/PAN badge rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Allow Viewer Self Profile Edit</span>
                <button
                  onClick={() => handleToggle('allowViewerProfileEdit')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.allowViewerProfileEdit ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.allowViewerProfileEdit ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Enables viewers to edit their Name, Mobile Number, WhatsApp, City, and Profile Details live.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Require Phone OTP Verification</span>
                <button
                  onClick={() => handleToggle('requirePhoneVerification')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.requirePhoneVerification ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.requirePhoneVerification ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Requires viewers to complete SMS/OTP phone verification before booking or submitting applications.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Allow Official ID Document Upload</span>
                <button
                  onClick={() => handleToggle('allowViewerIdUpload')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.allowViewerIdUpload ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.allowViewerIdUpload ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Allows viewers to upload Aadhaar or PAN card scan for official certified viewer status.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Display "Verified Viewer" Badge</span>
                <button
                  onClick={() => handleToggle('showVerifiedViewerBadge')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.showVerifiedViewerBadge ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showVerifiedViewerBadge ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Shows certified gold badge next to viewer's name on portal, booking invoices, and show passes.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1 font-semibold">
              Viewer Portal Custom Welcome Note (मराठी स्वागत संदेश)
            </label>
            <input
              type="text"
              value={features.viewerWelcomeNote || ''}
              onChange={(e) => setFeatures({ ...features, viewerWelcomeNote: e.target.value })}
              placeholder="आपले अधिकृत व्हीआयपी प्रोफाईल कस्टमायझेशन व पडताळणी केंद्र"
              className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      )}

      {/* TAB 5: HERO BANNER HEADLINES */}
      {activeTab === 'hero' && (
        <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-5">
          <div>
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-[#D4AF37]" />
              <span>Hero Cinematic Banner Custom Texts & Call-To-Actions</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Customize the main headline, subtitles, and button labels seen by every visitor.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Hero Top Monogram Badge Text
              </label>
              <input
                type="text"
                value={features.heroBadgeText || ''}
                onChange={(e) => setFeatures({ ...features, heroBadgeText: e.target.value })}
                placeholder="MAHARASHTRA'S PREMIER TALENT ROSTER"
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Main Hero Cinematic Headline
              </label>
              <input
                type="text"
                value={features.heroHeadline || ''}
                onChange={(e) => setFeatures({ ...features, heroHeadline: e.target.value })}
                placeholder="Building Stars. Creating Legacies."
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white font-cinzel font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Hero Explanatory Subtitle
              </label>
              <textarea
                rows={2}
                value={features.heroSubtitle || ''}
                onChange={(e) => setFeatures({ ...features, heroSubtitle: e.target.value })}
                placeholder="The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators."
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-300 block mb-1 font-semibold">
                  Primary Button 1 Label
                </label>
                <input
                  type="text"
                  value={features.heroPrimaryBtnText || ''}
                  onChange={(e) => setFeatures({ ...features, heroPrimaryBtnText: e.target.value })}
                  placeholder="Explore 500+ Talents (कलाकार शोधा)"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1 font-semibold">
                  Primary Button 2 Label
                </label>
                <input
                  type="text"
                  value={features.heroSecondaryBtnText || ''}
                  onChange={(e) => setFeatures({ ...features, heroSecondaryBtnText: e.target.value })}
                  placeholder="Direct Celebrity Booking (थेट बुकिंग करा)"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1 font-semibold">
                  Shows Button Label
                </label>
                <input
                  type="text"
                  value={features.heroShowsBtnText || ''}
                  onChange={(e) => setFeatures({ ...features, heroShowsBtnText: e.target.value })}
                  placeholder="Upcoming Shows & Passes (आगामी शोज)"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Talent Profile Showcase Admin Controls */}
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4 bg-[#111118]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#F3D068] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>Talent Profile Showcase Configuration (टॅलेंट प्रोफाईल शोकेस)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Admin decides whether to showcase or hide Talent Profiles on homepage, with custom badge, title, and Marathi/English subtitle.
                </p>
              </div>
              <button
                onClick={() => handleToggle('showVIPRoster')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  features.showVIPRoster ? 'bg-[#D4AF37]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow transition duration-200 ease-in-out ${
                    features.showVIPRoster ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-semibold">
                  Showcase Badge Text (बॅज मजकूर)
                </label>
                <input
                  type="text"
                  value={features.talentShowcaseBadge || ''}
                  onChange={(e) => setFeatures({ ...features, talentShowcaseBadge: e.target.value })}
                  placeholder="Exclusive Agency Ecosystem"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1 font-semibold">
                  Showcase Section Headline (मुख्य शीर्षक)
                </label>
                <input
                  type="text"
                  value={features.talentShowcaseTitle || ''}
                  onChange={(e) => setFeatures({ ...features, talentShowcaseTitle: e.target.value })}
                  placeholder="Official VIP Celebrity & Talent Roster"
                  className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-semibold">
                Showcase Explanatory Subtitle (माहिती/वर्णन मजकूर)
              </label>
              <textarea
                rows={2}
                value={features.talentShowcaseSubtitle || ''}
                onChange={(e) => setFeatures({ ...features, talentShowcaseSubtitle: e.target.value })}
                placeholder="Direct VIP bookings for India's leading cinematic actors, playback vocalists, international fashion supermodels, prime-time gala hosts, official media partners, and title sponsors."
                className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BOOKING & PASSES */}
      {activeTab === 'booking' && (
        <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-5">
          <div>
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Booking Permissions & Digital Pass Customization</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Configure visitor booking privileges, currency display, and automated PDF pass generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Instant VIP Talent Booking</span>
                <button
                  onClick={() => handleToggle('allowInstantBooking')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.allowInstantBooking ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.allowInstantBooking ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Allow visitors to open the booking quotation modal directly from any talent profile.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Digital PDF Pass Download</span>
                <button
                  onClick={() => handleToggle('allowPdfPassDownload')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.allowPdfPassDownload ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.allowPdfPassDownload ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Auto-generates official high-resolution PDF entry passes upon event/show registration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Direct Call Button on Profiles</span>
                <button
                  onClick={() => handleToggle('showDirectCallButton')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    features.showDirectCallButton ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${features.showDirectCallButton ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Shows quick phone call button directly on talent dossier cards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">Currency Display Format</span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'INR', label: 'INR (₹ रुपये)' },
                  { id: 'USD', label: 'USD ($ Dollar)' },
                  { id: 'AED', label: 'AED (د.إ Dirham)' },
                ].map(curr => (
                  <button
                    key={curr.id}
                    onClick={() => setFeatures({ ...features, currencyDisplay: curr.id as any })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                      features.currencyDisplay === curr.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="p-4 rounded-xl bg-[#101018] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All viewer panel settings are synced to database and immediately reflect on the frontend website.</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3D068] hover:brightness-110 text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition cursor-pointer disabled:opacity-50"
        >
          <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
          <span>{saving ? 'Publishing Changes...' : 'Save & Publish All Features (सर्व बदल सेव्ह करा)'}</span>
        </button>
      </div>
    </div>
  );
};
