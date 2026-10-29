import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import {
  initAuth,
  testConnection,
  SUPER_ADMIN_EMAIL
} from './firebase';
import {
  TalentCategory,
  TalentProfile,
  Package,
  TalentShow,
  Audition,
  PartnerProfile,
  SponsorProfile,
  MarketingBanner,
  SiteSettings,
  LiveTelecast,
  VideoMediaItem
} from './types';
import {
  checkIfAdmin,
  getTalentCategories,
  getTalentProfiles,
  getPackages,
  getTalentShows,
  getAuditions,
  getPartnerProfiles,
  getSponsorProfiles,
  getMarketingBanners,
  getSiteSettings,
  getLiveTelecasts,
  DEFAULT_LIVE_TELECAST,
  subscribeToPublicSiteData,
  getVideoMediaItems,
  getThemeSettings
} from './services/dbService';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';

// Homepage Components
import { HeroBanner } from './components/home/HeroBanner';
import { HomeFeaturesThreeLines } from './components/home/HomeFeaturesThreeLines';
import { MarketingBannerShowcase } from './components/home/MarketingBannerShowcase';
import { EventFestivalVideoSection } from './components/home/EventFestivalVideoSection';
import { UnifiedVIPRosterSection } from './components/home/UnifiedVIPRosterSection';
import { PartnersGrid } from './components/home/PartnersGrid';
import { UpcomingShowsSection } from './components/home/UpcomingShowsSection';
import { AuditionsSection } from './components/home/AuditionsSection';
import { PackagesSection } from './components/home/PackagesSection';
import { TeamContactSection } from './components/home/TeamContactSection';
import { TestimonialSliderSection } from './components/home/TestimonialSliderSection';

// Directory & Portal
import { TalentDirectory } from './components/directory/TalentDirectory';
import { ClientPortal } from './components/portal/ClientPortal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

// Modals
import { BookingModal } from './components/modals/BookingModal';
import { TalentDetailModal } from './components/modals/TalentDetailModal';
import { EventRegistrationModal } from './components/modals/EventRegistrationModal';
import { AuditionApplicationModal } from './components/modals/AuditionApplicationModal';
import { VoiceConciergeModal } from './components/concierge/VoiceConciergeModal';
import { ViewerProfileEditModal } from './components/modals/ViewerProfileEditModal';
import { OpeningLogoAnimation } from './components/common/OpeningLogoAnimation';
import { AICelebrityChatbot } from './components/common/AICelebrityChatbot';
import { ViewerNoticeTicker } from './components/common/ViewerNoticeTicker';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { ViewerAuthModal } from './components/common/ViewerAuthModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Database Collections
  const [categories, setCategories] = useState<TalentCategory[]>([]);
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [shows, setShows] = useState<TalentShow[]>([]);
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [liveTelecast, setLiveTelecast] = useState<LiveTelecast>(DEFAULT_LIVE_TELECAST);
  const [videoMediaItems, setVideoMediaItems] = useState<VideoMediaItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingTalent, setSelectedBookingTalent] = useState<TalentProfile | null>(null);
  const [selectedBookingPackage, setSelectedBookingPackage] = useState<Package | null>(null);
  const [customBookingType, setCustomBookingType] = useState<string | undefined>(undefined);

  const [talentDetailModalOpen, setTalentDetailModalOpen] = useState(false);
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<TalentProfile | null>(null);

  const [showRegModalOpen, setShowRegModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<TalentShow | null>(null);

  const [auditionAppModalOpen, setAuditionAppModalOpen] = useState(false);
  const [selectedAudition, setSelectedAudition] = useState<Audition | null>(null);

  const [voiceConciergeOpen, setVoiceConciergeOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [viewerProfileModalOpen, setViewerProfileModalOpen] = useState(false);
  const [viewerAuthModalOpen, setViewerAuthModalOpen] = useState(false);

  // Website Opening OTT-Style Logo Animation
  const [showOpeningIntro, setShowOpeningIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ava_intro_completed') !== 'true';
    } catch {
      return false;
    }
  });
  const [aiChatbotOpen, setAiChatbotOpen] = useState(false);

  const handleOpeningComplete = (_lang?: string) => {
    try {
      sessionStorage.setItem('ava_intro_completed', 'true');
    } catch {}
    setShowOpeningIntro(false);
  };

  const handleSkipOpening = (_lang?: string) => {
    try {
      sessionStorage.setItem('ava_intro_completed', 'true');
    } catch {}
    setShowOpeningIntro(false);
  };

  // 1. Initial Connection & Auth Listener
  useEffect(() => {
    testConnection();

    // Check strictly session-based admin credentials for current tab
    if (sessionStorage.getItem('ava_admin_session') === 'active') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    // Check direct URL hash or query for admin access
    const checkHash = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const isAdminRoute =
        hash === '#admin' ||
        hash === '#admin-panel' ||
        hash === '#admin-login' ||
        search.includes('admin=true') ||
        search.includes('admin=login') ||
        search.includes('admin=portal');

      if (isAdminRoute) {
        if (sessionStorage.getItem('ava_admin_session') === 'active') {
          setActiveSection('admin');
          setIsAdmin(true);
        } else {
          setAdminLoginModalOpen(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Global keyboard shortcut for admin login: Ctrl+Alt+A or Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (sessionStorage.getItem('ava_admin_session') === 'active') {
          setActiveSection('admin');
          setIsAdmin(true);
        } else {
          setAdminLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Google Auth listener: EXCLUSIVELY for Viewer Panel accounts
    const unsubscribe = initAuth(
      async (authUser) => {
        setUser(authUser);
      },
      () => {
        setUser(null);
      }
    );

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 2. Fetch Public Site Data from Firestore with Promise.allSettled for maximum resilience
  const loadSiteData = async () => {
    try {
      const results = await Promise.allSettled([
        getTalentCategories(true),
        getTalentProfiles(true),
        getPackages(true),
        getTalentShows(true),
        getAuditions(true),
        getPartnerProfiles(true),
        getSponsorProfiles(true),
        getMarketingBanners(true),
        getSiteSettings(),
        getLiveTelecasts(true),
        getVideoMediaItems(true)
      ]);

      const [
        catRes,
        profRes,
        pkgRes,
        showRes,
        audRes,
        partRes,
        sponRes,
        banRes,
        settingsRes,
        teleRes,
        videoRes
      ] = results;

      if (catRes.status === 'fulfilled') setCategories(catRes.value);
      if (profRes.status === 'fulfilled') setProfiles(profRes.value);
      if (pkgRes.status === 'fulfilled') setPackages(pkgRes.value);
      if (showRes.status === 'fulfilled') setShows(showRes.value);
      if (audRes.status === 'fulfilled') setAuditions(audRes.value);
      if (partRes.status === 'fulfilled') setPartners(partRes.value);
      if (sponRes.status === 'fulfilled') setSponsors(sponRes.value);
      if (banRes.status === 'fulfilled') setBanners(banRes.value);
      if (settingsRes.status === 'fulfilled') {
        setSiteSettings(settingsRes.value);
        if (settingsRes.value?.themeSettings) {
          applyThemeToDOM(settingsRes.value.themeSettings);
        }
      }
      if (teleRes.status === 'fulfilled' && teleRes.value?.length > 0) {
        setLiveTelecast(teleRes.value[0]);
      }
      if (videoRes.status === 'fulfilled') setVideoMediaItems(videoRes.value);
    } catch (err) {
      console.warn('Error fetching initial public records:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const applyThemeToDOM = (t: any) => {
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty('--ava-gold', t.customGoldColor || '#D4AF37');
    root.style.setProperty('--ava-bg', t.customBackgroundColor || '#07070A');
    if (t.preset) root.setAttribute('data-theme-preset', t.preset);
    if (t.goldGlowIntensity) root.setAttribute('data-theme-glow', t.goldGlowIntensity);
    if (t.cardBevelStyle) root.setAttribute('data-theme-bevel', t.cardBevelStyle);
    if (t.ambientLighting) root.setAttribute('data-theme-lighting', t.ambientLighting);
  };

  useEffect(() => {
    // Load and apply theme immediately
    getThemeSettings().then(applyThemeToDOM);

    loadSiteData();

    // Instant Real-time Synchronizer: Automatically updates Viewer Panel state on additions/edits
    const unsubscribeRealtime = subscribeToPublicSiteData({
      onProfiles: (liveProfiles) => setProfiles(liveProfiles),
      onCategories: (liveCategories) => setCategories(liveCategories),
      onShows: (liveShows) => setShows(liveShows),
      onBanners: (liveBanners) => setBanners(liveBanners),
      onTelecast: (liveTele) => setLiveTelecast(liveTele),
      onVideoMedia: (liveVideos) => setVideoMediaItems(liveVideos),
    });

    return () => {
      unsubscribeRealtime();
    };
  }, []);

  // Track currently active modal in ref to ensure popstate handler has latest reference
  const openModalRef = useRef<string | null>(null);

  useEffect(() => {
    if (talentDetailModalOpen) openModalRef.current = 'talentDetail';
    else if (bookingModalOpen) openModalRef.current = 'booking';
    else if (showRegModalOpen) openModalRef.current = 'showReg';
    else if (auditionAppModalOpen) openModalRef.current = 'auditionApp';
    else if (adminLoginModalOpen) openModalRef.current = 'adminLogin';
    else if (voiceConciergeOpen) openModalRef.current = 'voiceConcierge';
    else if (viewerProfileModalOpen) openModalRef.current = 'viewerProfile';
    else openModalRef.current = null;
  }, [
    talentDetailModalOpen,
    bookingModalOpen,
    showRegModalOpen,
    auditionAppModalOpen,
    adminLoginModalOpen,
    voiceConciergeOpen,
    viewerProfileModalOpen
  ]);

  // Handle Browser & Mobile Hardware Back Button (popstate listener)
  useEffect(() => {
    // Seed initial state if needed
    if (!window.history.state) {
      const initialSection = window.location.hash.replace('#', '') || 'home';
      window.history.replaceState({ section: initialSection, modal: null }, '', window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      // 1. If any modal was open, close it without changing section
      if (openModalRef.current) {
        setTalentDetailModalOpen(false);
        setBookingModalOpen(false);
        setShowRegModalOpen(false);
        setAuditionAppModalOpen(false);
        setAdminLoginModalOpen(false);
        setVoiceConciergeOpen(false);
        setViewerProfileModalOpen(false);
        openModalRef.current = null;
        return;
      }

      // 2. Otherwise restore section
      const targetSection = event.state?.section || (window.location.hash.replace('#', '') || 'home');
      setActiveSection(targetSection);
      if (event.state?.filterSlug) {
        setSelectedCategorySlug(event.state.filterSlug);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Routing / Navigation Handler with Browser History Push
  const handleNavigate = (section: string, filterSlug?: string, addToHistory = true) => {
    // If admin requested and not authenticated, open secret admin login dialog
    if (section === 'admin' && !isAdmin) {
      handleOpenAdminLogin();
      return;
    }
    const targetSection = section;
    setActiveSection(targetSection);
    if (filterSlug) {
      setSelectedCategorySlug(filterSlug);
    }
    if (addToHistory) {
      const hash = targetSection === 'home' ? '' : `#${targetSection}`;
      window.history.pushState(
        { section: targetSection, filterSlug: filterSlug || 'all', modal: null },
        '',
        window.location.pathname + hash
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to push modal to history for back button support
  const pushModalToHistory = (modalName: string) => {
    window.history.pushState(
      { section: activeSection, modal: modalName },
      '',
      window.location.pathname + window.location.hash
    );
  };

  // Safe modal close handler that aligns with history
  const handleCloseModal = (modalName: string) => {
    if (window.history.state?.modal === modalName) {
      window.history.back();
    } else {
      if (modalName === 'talentDetail') setTalentDetailModalOpen(false);
      if (modalName === 'booking') setBookingModalOpen(false);
      if (modalName === 'showReg') setShowRegModalOpen(false);
      if (modalName === 'auditionApp') setAuditionAppModalOpen(false);
      if (modalName === 'adminLogin') setAdminLoginModalOpen(false);
      if (modalName === 'voiceConcierge') setVoiceConciergeOpen(false);
      if (modalName === 'viewerProfile') setViewerProfileModalOpen(false);
      if (modalName === 'viewerAuth') setViewerAuthModalOpen(false);
    }
  };

  const handleOpenViewerProfile = () => {
    setViewerProfileModalOpen(true);
    pushModalToHistory('viewerProfile');
  };

  const handleOpenViewerAuth = () => {
    setViewerAuthModalOpen(true);
    pushModalToHistory('viewerAuth');
  };

  // Universal In-App Back Button Handler (works for Back buttons anywhere in the app)
  const handleGoBack = () => {
    if (openModalRef.current) {
      handleCloseModal(openModalRef.current);
      return;
    }
    if (activeSection !== 'home') {
      if (window.history.length > 1 && window.history.state?.section) {
        window.history.back();
      } else {
        handleNavigate('home');
      }
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking Modal Open Helpers
  const handleOpenGeneralBooking = (bookingType?: string) => {
    setSelectedBookingTalent(null);
    setSelectedBookingPackage(null);
    setCustomBookingType(bookingType);
    setBookingModalOpen(true);
    pushModalToHistory('booking');
  };

  const handleOpenTalentBooking = (profile: TalentProfile) => {
    setSelectedBookingTalent(profile);
    setSelectedBookingPackage(null);
    setCustomBookingType('Celebrity Appearance');
    setBookingModalOpen(true);
    pushModalToHistory('booking');
  };

  const handleOpenPackageBooking = (pkg: Package) => {
    setSelectedBookingTalent(null);
    setSelectedBookingPackage(pkg);
    setCustomBookingType(`Package: ${pkg.title}`);
    setBookingModalOpen(true);
    pushModalToHistory('booking');
  };

  // Talent Profile Detail View
  const handleViewProfile = (profile: TalentProfile) => {
    setSelectedDetailProfile(profile);
    setTalentDetailModalOpen(true);
    pushModalToHistory('talentDetail');
  };

  // Talent Show Registration View
  const handleRegisterShow = (show: TalentShow) => {
    setSelectedShow(show);
    setShowRegModalOpen(true);
    pushModalToHistory('showReg');
  };

  // Audition Application View
  const handleApplyAudition = (audition: Audition) => {
    setSelectedAudition(audition);
    setAuditionAppModalOpen(true);
    pushModalToHistory('auditionApp');
  };

  const handleOpenAdminLogin = () => {
    setAdminLoginModalOpen(true);
    pushModalToHistory('adminLogin');
  };

  const handleOpenVoiceConcierge = () => {
    setVoiceConciergeOpen(true);
    pushModalToHistory('voiceConcierge');
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-gray-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Master Admin Portal (Only rendered when user has verified administrative credentials) */}
      {activeSection === 'admin' && isAdmin ? (
        <AdminPanel
          user={user}
          onExitAdmin={() => {
            sessionStorage.removeItem('ava_admin_active');
            localStorage.removeItem('ava_admin_authorized');
            localStorage.removeItem('ava_admin_user');
            setIsAdmin(false);
            handleNavigate('home');
            loadSiteData();
          }}
          onSignOutAdmin={() => {
            sessionStorage.removeItem('ava_admin_active');
            localStorage.removeItem('ava_admin_authorized');
            localStorage.removeItem('ava_admin_user');
            setIsAdmin(false);
            handleNavigate('home');
            loadSiteData();
          }}
          onDataChange={loadSiteData}
        />
      ) : (
        /* Standard Public Viewer Experience (No admin access screens or prompts are shown to viewers) */
        <>
          {/* Top Live Announcement & Breaking News Marquee Ticker */}
          <ViewerNoticeTicker
            features={siteSettings?.viewerFeatures}
            onOpenBooking={() => handleOpenGeneralBooking('Announcement Inquiry')}
          />

          {/* Main Top Header & Navigation */}
          <Navbar
            user={user}
            isAdmin={isAdmin}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onBack={handleGoBack}
            onOpenBooking={() => handleOpenGeneralBooking()}
            onOpenVoiceConcierge={handleOpenVoiceConcierge}
            onOpenAdminLogin={handleOpenAdminLogin}
            onOpenProfile={handleOpenViewerProfile}
            onOpenViewerAuth={handleOpenViewerAuth}
            searchQuery={searchQuery}
            features={siteSettings?.viewerFeatures}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (activeSection !== 'talent' && q.trim()) {
                handleNavigate('talent');
              }
            }}
          />

          {/* Body Content based on active section */}
          <main className="flex-1 pb-16 md:pb-0">
            {activeSection !== 'home' && activeSection !== 'talent' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14141C] hover:bg-[#1E1E2C] text-gray-200 hover:text-[#F3D068] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-cinzel font-bold transition shadow-md group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
                  <span>← Back to Home (मुख्य पृष्ठावर परत जा)</span>
                </button>
              </div>
            )}

            {activeSection === 'home' && (
              <>
                {siteSettings?.viewerFeatures?.showHeroBanner !== false && (
                  <HeroBanner
                    banners={banners}
                    siteSettings={siteSettings}
                    onExploreTalent={() => handleNavigate('talent')}
                    onBookTalent={() => handleOpenGeneralBooking()}
                    onUpcomingShows={() => handleNavigate('shows')}
                  />
                )}

                {/* 3-Tier Command Hub: Customer Booking, Talent Profiles & Production */}
                {siteSettings?.viewerFeatures?.showCommandHubThreeLines !== false && (
                  <HomeFeaturesThreeLines
                    onOpenBooking={(type) => handleOpenGeneralBooking(type)}
                    onNavigate={handleNavigate}
                    onScrollToVideos={() => {
                      document.getElementById('events-festivals-videos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onScrollToPartners={() => {
                      document.getElementById('partners-sponsors')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Marketing Banner Section (Admin controlled campaigns & spotlights) */}
                {siteSettings?.viewerFeatures?.showMarketingBanners !== false && (
                  <MarketingBannerShowcase
                    banners={banners}
                    onOpenBooking={(title, _note) => handleOpenGeneralBooking(title || 'Marketing Campaign Booking')}
                    onExploreCategory={() => handleNavigate('talent')}
                  />
                )}

                {/* Official Event & Festival Long Video Showcase (Only Real Admin Uploads - Zero Demo/Live Streams) */}
                {siteSettings?.viewerFeatures?.showEventFestivalVideos !== false && (
                  <EventFestivalVideoSection
                    videos={videoMediaItems}
                    onBookTalent={(title) => handleOpenGeneralBooking(title ? `Event/Festival Video Booking: ${title}` : 'Event & Festival Video Booking')}
                  />
                )}

                {/* Unified Official VIP Celebrity & Talent Roster (Actors, Singers, Models, Anchors, Partners, Sponsors) */}
                {siteSettings?.viewerFeatures?.showVIPRoster !== false && (
                  <UnifiedVIPRosterSection
                    profiles={profiles}
                    partners={partners}
                    sponsors={sponsors}
                    customTitle={siteSettings?.viewerFeatures?.talentShowcaseTitle}
                    customSubtitle={siteSettings?.viewerFeatures?.talentShowcaseSubtitle}
                    customBadge={siteSettings?.viewerFeatures?.talentShowcaseBadge}
                    onViewProfile={handleViewProfile}
                    onBookTalent={handleOpenTalentBooking}
                    onOpenBooking={handleOpenGeneralBooking}
                    onExploreDirectory={(slug) => handleNavigate('talent', slug)}
                  />
                )}



                {/* Official Partners & Sponsors Prestige Pavilion with Admin Slider Customization */}
                {siteSettings?.viewerFeatures?.showPartnersGrid !== false && (
                  <PartnersGrid
                    partners={partners}
                    sponsors={sponsors}
                    onOpenBooking={(type) => handleOpenGeneralBooking(type)}
                    sliderSettings={siteSettings?.partnerSliderSettings}
                  />
                )}



                {/* Professional Executive Team Contact Section (Google Sheets Connected & Digital PDF) */}
                {siteSettings?.viewerFeatures?.showTeamContact !== false && (
                  <TeamContactSection />
                )}
              </>
            )}

            {activeSection === 'talent' && (
              <TalentDirectory
                categories={categories}
                profiles={profiles}
                shows={shows}
                initialCategorySlug={selectedCategorySlug}
                onViewProfile={handleViewProfile}
                onBookTalent={handleOpenTalentBooking}
                onBack={handleGoBack}
              />
            )}

            {activeSection === 'partners' && (
              <div className="py-8 sm:py-12">
                <PartnersGrid
                  partners={partners}
                  sponsors={sponsors}
                  onOpenBooking={(type) => handleOpenGeneralBooking(type)}
                  sliderSettings={siteSettings?.partnerSliderSettings}
                />
              </div>
            )}

            {activeSection === 'shows' && (
              <div className="py-8 sm:py-12">
                <UpcomingShowsSection
                  shows={shows}
                  onRegisterShow={handleRegisterShow}
                  onViewShowDetails={(show) => handleRegisterShow(show)}
                />
              </div>
            )}

            {activeSection === 'auditions' && (
              <div className="py-8 sm:py-12">
                <AuditionsSection
                  auditions={auditions}
                  onApplyAudition={handleApplyAudition}
                />
              </div>
            )}

            {activeSection === 'packages' && (
              <div className="py-8 sm:py-12">
                <PackagesSection
                  packages={packages}
                  onEnquirePackage={handleOpenPackageBooking}
                />
              </div>
            )}

            {activeSection === 'portal' && (
              <ClientPortal
                user={user}
                onNavigateHome={() => handleNavigate('home')}
                onOpenBooking={() => handleOpenGeneralBooking()}
                onOpenProfile={handleOpenViewerProfile}
                videos={videoMediaItems}
              />
            )}
          </main>

          {/* Footer */}
          <Footer
            onNavigate={handleNavigate}
            onOpenBooking={() => handleOpenGeneralBooking()}
            isAdmin={isAdmin}
            onReplayIntro={() => setShowOpeningIntro(true)}
            onOpenAdminLogin={handleOpenAdminLogin}
          />

          {/* Mobile Bottom Quick Action Dock */}
          {!showOpeningIntro && siteSettings?.viewerFeatures?.showMobileBottomNav !== false && (
            <MobileBottomNav
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onOpenBooking={() => handleOpenGeneralBooking()}
              onOpenVoiceConcierge={handleOpenVoiceConcierge}
            />
          )}

          {/* Floating WhatsApp Desk */}
          <FloatingWhatsAppButton
            features={siteSettings?.viewerFeatures}
            onOpenBooking={() => handleOpenGeneralBooking('WhatsApp VIP Enquiry')}
          />
        </>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => handleCloseModal('adminLogin')}
        onLoginSuccess={(_adminUser) => {
          setIsAdmin(true);
          setActiveSection('admin');
          loadSiteData();
        }}
      />

      {/* Booking Enquiry Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => handleCloseModal('booking')}
        selectedTalent={selectedBookingTalent}
        selectedPackage={selectedBookingPackage}
        customBookingType={customBookingType}
      />

      {/* Talent Detail Modal */}
      <TalentDetailModal
        profile={selectedDetailProfile}
        onClose={() => handleCloseModal('talentDetail')}
        onBookTalent={handleOpenTalentBooking}
      />



      {/* Talent Show Registration Modal */}
      <EventRegistrationModal
        show={selectedShow}
        onClose={() => handleCloseModal('showReg')}
      />

      {/* Audition Application Modal */}
      <AuditionApplicationModal
        audition={selectedAudition}
        onClose={() => handleCloseModal('auditionApp')}
      />

      {/* AI Voice Concierge Modal */}
      <VoiceConciergeModal
        isOpen={voiceConciergeOpen}
        onClose={() => handleCloseModal('voiceConcierge')}
        onOpenBooking={() => {
          handleCloseModal('voiceConcierge');
          handleOpenGeneralBooking();
        }}
      />

      {/* Viewer & Client Self Profile Edit & Real Verification Modal */}
      <ViewerProfileEditModal
        isOpen={viewerProfileModalOpen}
        onClose={() => handleCloseModal('viewerProfile')}
        user={user}
        onProfileUpdated={(_updated) => {
          // Profile refreshed
        }}
      />

      {/* Dedicated Viewer Google Sign-In Modal */}
      <ViewerAuthModal
        isOpen={viewerAuthModalOpen}
        onClose={() => handleCloseModal('viewerAuth')}
        user={user}
        onNavigateToPortal={() => handleNavigate('portal')}
        onOpenProfile={handleOpenViewerProfile}
      />

      {/* Real Human-Like AI Concierge Chatbot Widget */}
      {!showOpeningIntro && activeSection !== 'admin' && (
        <AICelebrityChatbot
          isOpen={aiChatbotOpen}
          onToggle={() => setAiChatbotOpen((prev) => !prev)}
          onOpenBooking={() => handleOpenGeneralBooking()}
          onNavigateRoster={() => handleNavigate('talent')}
        />
      )}

      {/* Website Opening OTT-Style Professional Logo Animation */}
      {showOpeningIntro && (
        <OpeningLogoAnimation
          onComplete={handleOpeningComplete}
          onSkip={handleSkipOpening}
        />
      )}
    </div>
  );
}
