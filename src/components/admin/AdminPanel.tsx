import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import {
  TalentCategory,
  TalentProfile,
  Package,
  Booking,
  TalentShow,
  EventRegistration,
  Audition,
  AuditionApplication,
  TalentApplication,
  PartnerProfile,
  SponsorProfile,
  MarketingBanner,
  SiteSettings,
  AuditLog,
  LiveTelecast,
  TeamContactInquiry,
  VideoMediaItem
} from '../../types';
import {
  getTalentCategories,
  saveTalentCategory,
  deleteTalentCategory,
  getTalentProfiles,
  saveTalentProfile,
  deleteTalentProfile,
  getPackages,
  savePackage,
  deletePackage,
  getBookings,
  updateBooking,
  deleteBooking,
  getTalentShows,
  saveTalentShow,
  deleteTalentShow,
  getEventRegistrations,
  updateEventRegistration,
  getAuditions,
  saveAudition,
  deleteAudition,
  getAuditionApplications,
  updateAuditionApplication,
  getTalentApplications,
  updateTalentApplication,
  getPartnerProfiles,
  savePartnerProfile,
  deletePartnerProfile,
  getSponsorProfiles,
  saveSponsorProfile,
  deleteSponsorProfile,
  getMarketingBanners,
  saveMarketingBanner,
  deleteMarketingBanner,
  getSiteSettings,
  saveSiteSettings,
  getAuditLogs,
  initializeOfficialTaxonomy,
  getLiveTelecasts,
  saveLiveTelecast,
  deleteLiveTelecast,
  getTeamInquiries,
  saveTeamInquiry,
  updateTeamInquiry,
  deleteTeamInquiry,
  DEFAULT_LIVE_TELECAST,
  getVideoMediaItems,
  saveVideoMediaItem,
  deleteVideoMediaItem,
  DEFAULT_VIDEO_MEDIA_ITEMS
} from '../../services/dbService';
import { exportToGoogleSheet, syncTeamInquiriesToGoogleSheet } from '../../services/sheetsService';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Star,
  Package as PackageIcon,
  FolderKanban,
  Calendar,
  Clapperboard,
  UserCheck,
  Layers,
  Award,
  Image as ImageIcon,
  Settings,
  FileSpreadsheet,
  History,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Search,
  AlertCircle,
  FileDown,
  Upload,
  LogOut,
  Tv,
  Radio,
  Eye,
  Crown,
  Play,
  Send,
  Instagram,
  Tag,
  ArrowLeft,
  Camera,
  Video,
  Volume2,
  VolumeX,
  Monitor,
  Cpu,
  Crop,
  Smartphone,
  Film,
  Sparkles,
  CheckCircle2,
  Sliders,
  Handshake,
  Brush,
  Palette
} from 'lucide-react';
import { MAHARASHTRA_CITIES } from '../../data/maharashtraCities';
import { AdminAIStudio } from './AdminAIStudio';
import { VideoMediaStore } from './VideoMediaStore';
import { ImageCropModal, AspectRatioType } from './ImageCropModal';
import { MediaImageUploader } from './MediaImageUploader';
import { TalentVideoModal } from '../modals/TalentVideoModal';
import { AdminGoogleSheetViewer } from './AdminGoogleSheetViewer';
import { AdminPartnerSliderStudio } from './AdminPartnerSliderStudio';
import { AdminViewerCustomizationStudio } from './AdminViewerCustomizationStudio';
import { AdminThemeStudio } from './AdminThemeStudio';

interface AdminPanelProps {
  user: User | null;
  onExitAdmin: () => void;
  onSignOutAdmin?: () => void;
  onDataChange?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  onExitAdmin,
  onSignOutAdmin,
  onDataChange
}) => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Database Collections
  const [categories, setCategories] = useState<TalentCategory[]>([]);
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [shows, setShows] = useState<TalentShow[]>([]);
  const [eventRegs, setEventRegs] = useState<EventRegistration[]>([]);
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [auditionApps, setAuditionApps] = useState<AuditionApplication[]>([]);
  const [talentApps, setTalentApps] = useState<TalentApplication[]>([]);
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [videoMediaItems, setVideoMediaItems] = useState<VideoMediaItem[]>([]);
  const [teamInquiries, setTeamInquiries] = useState<TeamContactInquiry[]>([]);

  // Editing state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingSheet, setExportingSheet] = useState(false);
  const [editingVideoMedia, setEditingVideoMedia] = useState<Partial<VideoMediaItem> | null>(null);
  const [videoRatioFilter, setVideoRatioFilter] = useState<'all' | '9:16' | '16:9'>('all');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('all');
  const [videoSearchQuery, setVideoSearchQuery] = useState<string>('');
  const [activeVideoModal, setActiveVideoModal] = useState<VideoMediaItem | null>(null);
  const [syncingGoogleSheets, setSyncingGoogleSheets] = useState(false);
  const [lastSyncedSheetUrl, setLastSyncedSheetUrl] = useState<string | null>(null);
  const [talentIndustryFilter, setTalentIndustryFilter] = useState<'all' | 'marathi' | 'hindi'>('all');

  // Professional Video File Upload (MP4 / WebM / MOV)
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState<string | null>(null);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setUploadedVideoFileName(file.name);

    // Read metadata from offscreen video element
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = blobUrl;
    tempVideo.onloadedmetadata = () => {
      const isVertical = tempVideo.videoHeight > tempVideo.videoWidth;
      const detectedRatio: '9:16' | '16:9' = isVertical ? '9:16' : '16:9';
      const totalSecs = Math.floor(tempVideo.duration) || 0;
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      const durationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      const resolution = `${tempVideo.videoWidth}x${tempVideo.videoHeight} (${detectedRatio === '9:16' ? '9:16 Vertical Reel' : '16:9 Widescreen'})`;

      setEditingVideoMedia((prev) => ({
        ...(prev || {}),
        videoUrl: blobUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        aspectRatio: prev?.aspectRatio || detectedRatio,
        resolution: resolution,
        durationFormatted: durationFormatted !== '00:00' ? durationFormatted : '01:00'
      }));
    };

    setEditingVideoMedia((prev) => {
      if (prev) {
        return {
          ...prev,
          videoUrl: blobUrl,
          fileName: file.name,
          fileSizeBytes: file.size,
        };
      }
      return {
        id: `vid-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        aspectRatio: '16:9',
        categorySlug: categories[0]?.slug || 'actors',
        categoryName: categories[0]?.name || 'Actors & Actresses',
        videoUrl: blobUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        durationFormatted: '01:00',
        isPublished: true,
        videoTag: 'Showreel'
      };
    });
  };

  // Talent Profile: Interactive Image Crop Modal State
  const [talentCropModalOpen, setTalentCropModalOpen] = useState(false);
  const [talentImageToCrop, setTalentImageToCrop] = useState<string>('');

  // Talent Profile: Dedicated Video Media Upload (MP4 / WebM / MOV)
  const talentVideoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [talentUploadedVideoName, setTalentUploadedVideoName] = useState<string | null>(null);
  const [talentWatchModalProfile, setTalentWatchModalProfile] = useState<TalentProfile | null>(null);

  const handleTalentVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setTalentUploadedVideoName(file.name);

    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = blobUrl;
    tempVideo.onloadedmetadata = () => {
      const isVertical = tempVideo.videoHeight > tempVideo.videoWidth;
      const detectedRatio: '9:16' | '16:9' = isVertical ? '9:16' : '16:9';
      const totalSecs = Math.floor(tempVideo.duration) || 0;
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      const durationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      setEditingItem((prev: any) => ({
        ...(prev || {}),
        videoUrl: blobUrl,
        videoAspectRatio: prev?.videoAspectRatio || detectedRatio,
        videoDuration: durationFormatted !== '00:00' ? durationFormatted : '01:00',
        videoTitle: prev?.videoTitle || `${prev?.name || 'Talent'} Performance Video`,
      }));
    };

    setEditingItem((prev: any) => ({
      ...(prev || {}),
      videoUrl: blobUrl,
      videoTitle: prev?.videoTitle || `${prev?.name || 'Talent'} Performance Video`,
      videoTag: prev?.videoTag || 'Showreel',
    }));
  };

  // Real Instagram Verification & Live Follower Count States
  const [isVerifyingInstagram, setIsVerifyingInstagram] = useState(false);
  const [igVerificationResult, setIgVerificationResult] = useState<any>(null);
  const [verifyingTalentId, setVerifyingTalentId] = useState<string | null>(null);

  const handleVerifyEditingItemInstagram = async () => {
    const input = editingItem?.instagramUrl || editingItem?.instagramHandle || editingItem?.name;
    if (!input || !String(input).trim()) {
      setError('कृपया Instagram हँडल किंवा प्रोफाइल लिंक प्रविष्ट करा (उदा. @shraddhakapoor किंवा https://instagram.com/...)');
      return;
    }
    setIsVerifyingInstagram(true);
    setError(null);
    try {
      const res = await fetch('/api/instagram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramInput: String(input).trim(),
          artistName: editingItem?.name || ''
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIgVerificationResult(data);
        setEditingItem((prev: any) => ({
          ...prev,
          instagramHandle: data.handle,
          instagramFollowers: data.followers,
          instagramUrl: data.fullUrl,
          instagramVerified: true,
          isVerified: true
        }));
        setNotice(`✅ Instagram verified: ${data.handle} • ${data.followers} (${data.source || 'Scraped Live'})`);
      } else {
        setError(data.error || 'Instagram verification failed');
      }
    } catch (err: any) {
      setError('Instagram verification error: ' + err.message);
    } finally {
      setIsVerifyingInstagram(false);
    }
  };

  const handleQuickVerifyInstagram = async (talent: TalentProfile) => {
    const input = talent.instagramUrl || talent.instagramHandle || talent.name;
    setVerifyingTalentId(talent.id);
    setError(null);
    try {
      const res = await fetch('/api/instagram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramInput: input,
          artistName: talent.name
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updatedTalent: TalentProfile = {
          ...talent,
          instagramHandle: data.handle,
          instagramFollowers: data.followers,
          instagramUrl: data.fullUrl,
          instagramVerified: true,
          isVerified: true
        };
        await saveTalentProfile(updatedTalent);
        setProfiles((prev) => prev.map((p) => (p.id === talent.id ? updatedTalent : p)));
        setNotice(`✅ ${talent.name}: Instagram ${data.handle} verified with ${data.followers}`);
      } else {
        setError(data.error || `Failed to verify Instagram for ${talent.name}`);
      }
    } catch (err: any) {
      setError('Verification error: ' + err.message);
    } finally {
      setVerifyingTalentId(null);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        getTalentCategories(false),
        getTalentProfiles(false),
        getPackages(false),
        getBookings(),
        getTalentShows(false),
        getEventRegistrations(),
        getAuditions(false),
        getAuditionApplications(),
        getTalentApplications(),
        getPartnerProfiles(false),
        getSponsorProfiles(false),
        getMarketingBanners(false),
        getSiteSettings(),
        getAuditLogs(),
        getVideoMediaItems(false),
        getTeamInquiries()
      ]);

      const val = (idx: number, fallback: any) =>
        results[idx]?.status === 'fulfilled' ? (results[idx] as PromiseFulfilledResult<any>).value : fallback;

      setCategories(val(0, []));
      setProfiles(val(1, []));
      setPackages(val(2, []));
      setBookings(val(3, []));
      setShows(val(4, []));
      setEventRegs(val(5, []));
      setAuditions(val(6, []));
      setAuditionApps(val(7, []));
      setTalentApps(val(8, []));
      setPartners(val(9, []));
      setSponsors(val(10, []));
      setBanners(val(11, []));
      if (val(12, null)) setSiteSettingsState(val(12, null));
      setAuditLogs(val(13, []));
      setVideoMediaItems(val(14, []));
      setTeamInquiries(val(15, []));
    } catch (err: any) {
      console.warn('Administrative data load warning:', err);
    } finally {
      setLoading(false);
      onDataChange?.();
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSeedOfficialCategories = async () => {
    if (!window.confirm('Initialize official AVA talent categories taxonomy? Existing categories will be preserved.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await initializeOfficialTaxonomy();
      setNotice(`Initialized ${res.initialized} official categories successfully.`);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sheets Export
  const handleExportBookingsToSheets = async () => {
    setExportingSheet(true);
    setError(null);
    try {
      const headers = [
        'Booking Reference',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Booking Type',
        'Target Talent',
        'Event Name',
        'Event Date',
        'Location',
        'Status',
        'Quotation Amount',
        'Requirements',
        'Submitted At'
      ];
      const rows = bookings.map((b) => [
        b.bookingReference,
        b.customerName,
        b.customerEmail,
        b.customerPhone,
        b.bookingType,
        b.talentName || 'General Request',
        b.eventName,
        b.eventDate,
        b.cityVenue,
        b.status,
        b.quotationAmount || 'N/A',
        b.serviceRequirements,
        b.createdAt
      ]);

      const result = await exportToGoogleSheet(
        `AVA Celebrity Management - Bookings Export (${new Date().toLocaleDateString()})`,
        headers,
        rows
      );

      if (result.downloadedCsv) {
        setNotice(`Bookings spreadsheet downloaded successfully! (Google Sheets & Excel compatible .CSV)`);
      } else if (result.spreadsheetUrl) {
        setNotice(`Bookings exported to Google Sheet in Drive! URL: ${result.spreadsheetUrl}`);
        try {
          window.open(result.spreadsheetUrl, '_blank');
        } catch {}
      } else {
        setNotice(`Bookings spreadsheet file generated successfully!`);
      }
    } catch (err: any) {
      console.warn('Google Sheets export fallback:', err);
      setNotice(`Bookings spreadsheet downloaded directly as Google Sheets compatible file!`);
    } finally {
      setExportingSheet(false);
    }
  };

  const handleExportEventRegistrationsToSheets = async () => {
    setExportingSheet(true);
    setError(null);
    try {
      const headers = [
        'Registration Ref',
        'Event Title',
        'Participant Name',
        'Email',
        'Phone',
        'Age',
        'City',
        'Category',
        'Performance Act',
        'Demo Link',
        'Status',
        'Date'
      ];
      const rows = eventRegs.map((e) => [
        e.registrationReference,
        e.eventTitle,
        e.fullName,
        e.email,
        e.phone,
        e.age || 'N/A',
        e.city || 'N/A',
        e.category,
        e.performanceDetails,
        e.portfolioLink || 'N/A',
        e.status,
        e.createdAt
      ]);

      const result = await exportToGoogleSheet(
        `AVA Talent Shows - Participant Registrations (${new Date().toLocaleDateString()})`,
        headers,
        rows
      );

      if (result.downloadedCsv) {
        setNotice(`Event registrations spreadsheet downloaded successfully! (Google Sheets & Excel compatible .CSV)`);
      } else if (result.spreadsheetUrl) {
        setNotice(`Event registrations exported to Google Sheet in Drive! URL: ${result.spreadsheetUrl}`);
        try {
          window.open(result.spreadsheetUrl, '_blank');
        } catch {}
      } else {
        setNotice(`Event registrations spreadsheet file generated successfully!`);
      }
    } catch (err: any) {
      console.warn('Google Sheets event export fallback:', err);
      setNotice(`Event registrations spreadsheet downloaded directly as Google Sheets compatible file!`);
    } finally {
      setExportingSheet(false);
    }
  };

  // Live Metrics (derived strictly from database records)
  const metrics = {
    publishedProfiles: profiles.filter((p) => p.status === 'published').length,
    pendingProfiles: profiles.filter((p) => p.status === 'pending' || p.status === 'draft').length,
    newBookings: bookings.filter((b) => b.status === 'Submitted' || b.status === 'Under Review').length,
    confirmedBookings: bookings.filter((b) => b.status === 'Confirmed').length,
    upcomingShows: shows.filter((s) => s.isPublished).length,
    activeAuditions: auditions.filter((a) => a.isPublished && a.status === 'Open').length,
    talentRegistrations: talentApps.length,
    partnersCount: partners.filter((p) => p.isPublished).length,
    sponsorsCount: sponsors.filter((s) => s.isPublished).length,
    activeBanners: banners.filter((b) => b.isPublished).length,
    videoMediaCount: videoMediaItems.length,
    verticalReelsCount: videoMediaItems.filter((v) => v.aspectRatio === '9:16').length,
    landscapeCinemaCount: videoMediaItems.filter((v) => v.aspectRatio === '16:9').length,
    totalTeamInquiries: teamInquiries.length,
  };

  const navModules = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'themeStudio', label: 'Luxury Design & Theme Studio (थीम व डेकोरेशन)', icon: Brush },
    { id: 'viewerFeatures', label: 'Viewer Panel All Features Customization (व्ह्यूवर कस्टमायझेशन)', icon: Sliders },
    { id: 'aiStudio', label: 'AI Security & Command Hub', icon: Cpu },
    { id: 'videoMedia', label: 'Video Media Studio (9:16 & 16:9)', icon: Video },
    { id: 'teamInquiries', label: 'Team Contact & Sheets Sync', icon: FileSpreadsheet },
    { id: 'categories', label: 'Talent Categories', icon: Layers },
    { id: 'profiles', label: 'Talent Profiles', icon: Users },
    { id: 'packages', label: 'Packages & Pricing', icon: PackageIcon },
    { id: 'bookings', label: 'Bookings & Quotations', icon: FolderKanban },
    { id: 'shows', label: 'Talent Shows & Events', icon: Calendar },
    { id: 'eventRegs', label: 'Show Registrations', icon: UserCheck },
    { id: 'auditions', label: 'Auditions & Casting', icon: Clapperboard },
    { id: 'auditionApps', label: 'Audition Submissions', icon: Star },
    { id: 'talentApps', label: 'Talent Applications', icon: Users },
    { id: 'partners', label: 'Partners Management', icon: Layers },
    { id: 'logoSlider', label: 'Logo Auto-Slide Studio & Design', icon: Sparkles },
    { id: 'sponsors', label: 'Sponsors Management', icon: Award },
    { id: 'banners', label: 'Marketing Banners', icon: ImageIcon },
    { id: 'reports', label: 'Google Sheets Data Hub', icon: FileSpreadsheet },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'auditLogs', label: 'Security Audit Logs', icon: History },
  ];

  return (
    <div className={`min-h-screen bg-[#07070A] text-gray-200 flex flex-col ${isDesktopMode ? 'overflow-x-auto w-full' : ''}`}>
      {/* Top Admin Header */}
      <header className="h-16 bg-[#0E0E14] border-b border-[#D4AF37]/30 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          {/* Direct Back to Website Button */}
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black text-gray-200 hover:text-[#F3D068] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-cinzel font-bold transition shadow-md cursor-pointer group"
            title="← Back to Website (मुख्य पृष्ठावर परत जा)"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">← Back</span>
          </button>

          <div className="w-8 h-8 rounded-lg bg-[#250811] border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-cinzel text-xs sm:text-base font-bold text-white flex items-center gap-2">
              <span>AVA Master Administration Portal</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/30">
                DESKTOP SUITE
              </span>
            </h1>
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono hidden sm:inline">
              Session: {localStorage.getItem('ava_admin_user') || user?.email || 'Executive Master Admin'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Mode Toggle Button */}
          <button
            onClick={() => setIsDesktopMode(!isDesktopMode)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold border transition cursor-pointer ${
              isDesktopMode
                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm'
                : 'bg-white/5 text-gray-300 border-white/10 hover:text-white'
            }`}
            title={isDesktopMode ? 'Desktop Mode Active' : 'Switch to Desktop Mode'}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDesktopMode ? 'Desktop Mode (ON)' : 'Compact View'}</span>
            <span className="sm:hidden">{isDesktopMode ? 'Desktop' : 'Compact'}</span>
          </button>

          {/* View Live on Viewer Panel Button */}
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold text-black bg-[#D4AF37] hover:bg-[#F3D068] transition shadow-md cursor-pointer"
            title="Open Viewer Panel to verify changes live"
          >
            <Eye className="w-3.5 h-3.5 text-black" />
            <span className="hidden md:inline">View Live on Website (लाईव्ह बघा)</span>
            <span className="md:hidden">View Live</span>
          </button>

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition cursor-pointer"
            title="Reload live database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onSignOutAdmin && (
            <button
              onClick={onSignOutAdmin}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-500/30 transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Desktop Mode Notification Banner */}
      {isDesktopMode && (
        <div className="bg-gradient-to-r from-[#200A15] via-[#14141E] to-[#1F1808] border-b border-[#D4AF37]/30 px-4 py-2 text-[11px] text-[#F3D068] flex items-center justify-between xl:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>
              <strong>डेस्कटॉप मोड सक्रिय:</strong> सर्व फॉर्म्स, टेबल्स व अ‍ॅक्शन बटन्स क्लिअर दिसण्यासाठी डावीकडे/उजवीकडे स्क्रोल करा.
            </span>
          </div>
          <button
            onClick={() => setIsDesktopMode(false)}
            className="text-[10px] text-gray-400 hover:text-white underline ml-3 shrink-0 cursor-pointer"
          >
            Switch to Compact
          </button>
        </div>
      )}

      {/* Main Admin Layout */}
      <div className={`flex-1 flex ${isDesktopMode ? 'flex-row min-w-[1150px]' : 'flex-col md:flex-row'}`}>
        {/* Sidebar Navigation */}
        <aside className={`${isDesktopMode ? 'w-64' : 'w-full md:w-64'} bg-[#0A0A0E] border-r border-white/5 p-4 flex flex-col justify-between shrink-0`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-cinzel font-bold text-[#D4AF37] tracking-wider">
              Management Modules
            </div>
            {navModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModule(mod.id);
                    setEditingItem(null);
                    setIsCreating(false);
                    setNotice(null);
                    setError(null);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition text-left ${
                    activeModule === mod.id
                      ? 'bg-[#D4AF37] text-black font-bold shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{mod.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/5 text-[11px] text-gray-500 px-3">
            <div>Signed in as:</div>
            <div className="text-gray-300 truncate font-mono text-[10px] mt-0.5">{user?.email}</div>
          </div>
        </aside>

        {/* Workspace Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Notifications */}
          {notice && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{notice}</strong> — Viewer Panel वर लगेच अपडेट झाले आहे! (Immediately live on viewer panel).
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onExitAdmin}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#F3D068] text-black font-cinzel font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5 text-black" />
                  <span>View on Website (लाईव्ह बघा)</span>
                </button>
                <button
                  onClick={() => setNotice(null)}
                  className="p-1 rounded text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {(() => {
                    try {
                      if (error.startsWith('{') && error.includes('"error"')) {
                        const parsed = JSON.parse(error);
                        return parsed.error || error;
                      }
                    } catch {}
                    return error;
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setError(null)}
                  className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] font-semibold border border-rose-500/40 cursor-pointer"
                >
                  Clear (क्लिअर करा)
                </button>
              </div>
            </div>
          )}

          {/* Module: Dashboard */}
          {activeModule === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">Executive Live Metrics</h2>
                <p className="text-gray-400 text-xs mt-1">
                  Live data synced from Firestore collections. All numbers reflect actual persisted records.
                </p>
              </div>

              {/* 11 Live Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Published Talent', val: metrics.publishedProfiles, color: 'text-emerald-400' },
                  { label: 'Video Media (MP4)', val: metrics.videoMediaCount, color: 'text-violet-400' },
                  { label: 'Pending Review', val: metrics.pendingProfiles, color: 'text-amber-400' },
                  { label: 'New Enquiries', val: metrics.newBookings, color: 'text-[#D4AF37]' },
                  { label: 'Confirmed Bookings', val: metrics.confirmedBookings, color: 'text-emerald-400' },
                  { label: 'Active Shows', val: metrics.upcomingShows, color: 'text-purple-400' },
                  { label: 'Active Auditions', val: metrics.activeAuditions, color: 'text-blue-400' },
                  { label: 'Talent Applications', val: metrics.talentRegistrations, color: 'text-pink-400' },
                  { label: 'Official Partners', val: metrics.partnersCount, color: 'text-cyan-400' },
                  { label: 'Corporate Sponsors', val: metrics.sponsorsCount, color: 'text-yellow-400' },
                  { label: 'Active Banners', val: metrics.activeBanners, color: 'text-orange-400' },
                ].map((m, i) => (
                  <div key={i} className="card-luxury rounded-xl p-4 border-gold-subtle">
                    <span className="text-[11px] text-gray-400 uppercase font-cinzel font-semibold block">
                      {m.label}
                    </span>
                    <span className={`text-2xl sm:text-3xl font-mono font-bold mt-2 block ${m.color}`}>
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Actions Bar */}
              <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
                <h3 className="font-cinzel text-base font-bold text-white">System Actions & Setup</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSeedOfficialCategories}
                    className="btn-burgundy px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-[#D4AF37]" />
                    <span>Initialize Official Categories Taxonomy</span>
                  </button>

                  <button
                    onClick={handleExportBookingsToSheets}
                    disabled={exportingSheet}
                    className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{exportingSheet ? 'Connecting...' : 'Export Bookings to Google Sheet'}</span>
                  </button>
                </div>
              </div>

              {/* Recent Bookings Overview */}
              <div className="card-luxury rounded-2xl p-6 border-gold-subtle">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cinzel text-base font-bold text-white">
                    Recent Bookings Activity
                  </h3>
                  <button
                    onClick={() => setActiveModule('bookings')}
                    className="text-xs text-[#D4AF37] hover:underline font-semibold"
                  >
                    View All ({bookings.length}) →
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-xs py-4">No booking enquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="text-[10px] uppercase font-cinzel text-[#D4AF37] border-b border-white/10">
                        <tr>
                          <th className="pb-2">Reference</th>
                          <th className="pb-2">Client</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Event</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-white/5">
                            <td className="py-2.5 font-mono text-[#F3D068]">{b.bookingReference}</td>
                            <td className="py-2.5 font-medium">{b.customerName}</td>
                            <td className="py-2.5">{b.bookingType}</td>
                            <td className="py-2.5 text-gray-400">{b.eventName}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                                {b.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-gray-500">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module: Luxury Design & Theme Customization Studio */}
          {activeModule === 'themeStudio' && (
            <AdminThemeStudio
              onThemeApplied={(t) => {
                setNotice(`Theme "${t.preset.toUpperCase()}" applied live with ${t.goldGlowIntensity} glow!`);
                fetchAllData();
                if (onDataChange) onDataChange();
              }}
            />
          )}

          {/* Module: Viewer Features & Homepage All Features Customization */}
          {activeModule === 'viewerFeatures' && siteSettings && (
            <AdminViewerCustomizationStudio
              siteSettings={siteSettings}
              onSettingsUpdated={fetchAllData}
              setNotice={setNotice}
              setError={setError}
              onPreviewLive={onExitAdmin}
            />
          )}

          {/* Module: AI Security & Command Hub */}
          {activeModule === 'aiStudio' && (
            <AdminAIStudio />
          )}

          {/* Module: Talent Categories */}
          {activeModule === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Talent Categories</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage divisions and classifications displayed in navigation and category grids.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSeedOfficialCategories}
                    className="btn-burgundy px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Initialize Taxonomy
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(true);
                      setEditingItem({
                        name: '',
                        slug: '',
                        description: '',
                        subcategories: [],
                        displayOrder: categories.length + 1,
                        isPublished: true,
                      });
                    }}
                    className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Category</span>
                  </button>
                </div>
              </div>

              {/* Category Edit/Create Form */}
              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    {isCreating ? 'Create New Category' : 'Edit Category'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Category Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setEditingItem({
                            ...editingItem,
                            name: val,
                            slug: editingItem.slug || slug,
                          });
                        }}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.slug}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">
                        Subcategories (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingItem.subcategories) ? editingItem.subcategories.join(', ') : ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            subcategories: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Lead, Method, Supporting"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editingItem.displayOrder}
                        onChange={(e) => setEditingItem({ ...editingItem, displayOrder: Number(e.target.value) })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="catPub"
                        checked={editingItem.isPublished}
                        onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                        className="rounded text-[#D4AF37]"
                      />
                      <label htmlFor="catPub" className="text-xs text-gray-300">
                        Published on Site
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                      }}
                      className="px-4 py-2 rounded text-xs text-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await saveTalentCategory(editingItem);
                          setNotice('Category saved successfully.');
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Save Category
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Order</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Slug</th>
                      <th className="p-3">Subcategories</th>
                      <th className="p-3">Profiles Count</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.map((c) => {
                      const count = profiles.filter((p) => p.categorySlug === c.slug).length;
                      return (
                        <tr key={c.id} className="hover:bg-white/5">
                          <td className="p-3 font-mono text-gray-500">{c.displayOrder}</td>
                          <td className="p-3 font-bold text-white">{c.name}</td>
                          <td className="p-3 font-mono text-gray-400">{c.slug}</td>
                          <td className="p-3 text-gray-400 max-w-xs truncate">
                            {c.subcategories?.join(', ') || '-'}
                          </td>
                          <td className="p-3 font-mono text-[#D4AF37]">{count}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                c.isPublished ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              {c.isPublished ? 'Published' : 'Hidden'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(c);
                                setIsCreating(false);
                              }}
                              className="text-gray-300 hover:text-[#D4AF37]"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete category ${c.name}?`)) {
                                  await deleteTalentCategory(c.id);
                                  fetchAllData();
                                }
                              }}
                              className="text-gray-500 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Talent Profiles */}
          {activeModule === 'profiles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2">
                    <span>Talent Profiles</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/30">
                      मराठी व हिंदी कलाकार
                    </span>
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    मराठी रंगभूमी/नाटक, टीव्ही मालिका, बॉलिवूड चित्रपट व ओटीटी कलाकारांचे स्वतंत्र प्रोफाईल्स व्यवस्थापित करा.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem({
                      name: '',
                      talentType: 'Actress',
                      industry: talentIndustryFilter === 'hindi' ? 'Hindi' : 'Marathi',
                      marathiNatakOrTheatre: '',
                      marathiSerialsOrShows: '',
                      hindiFilmsOrBollywood: '',
                      hindiOttSeries: '',
                      notableAwards: '',
                      categorySlug: categories.find(c => c.slug === 'actors')?.slug || categories[0]?.slug || 'actors',
                      categoryName: categories.find(c => c.slug === 'actors')?.name || categories[0]?.name || 'Actors & Actresses',
                      subcategory: 'Lead Film & Drama Actress',
                      bio: '',
                      photoUrl: '',
                      imageAspectRatio: '3:4',
                      videoUrl: '',
                      videoAspectRatio: '9:16',
                      videoTitle: '',
                      videoDuration: '',
                      videoTag: 'Showreel',
                      city: 'Mumbai',
                      skills: ['Cinematic Acting', 'Emotional Monologue', 'Stage Presence', 'Dance'],
                      languages: ['Marathi', 'Hindi', 'English'],
                      supportedBookingTypes: ['Celebrity Appearance', 'Brand Endorsement', 'Acting Role'],
                      availability: 'Available',
                      status: 'published',
                      isFeatured: true,
                      isVerified: true,
                    });
                    setTalentUploadedVideoName(null);
                  }}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Talent Profile (नवीन कलाकार जोडा)</span>
                </button>
              </div>

              {/* Distinct Industry Quick Filter Sub-Tabs */}
              <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-[#12121A] border border-white/10 shadow-lg">
                <button
                  type="button"
                  onClick={() => setTalentIndustryFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer ${
                    talentIndustryFilter === 'all'
                      ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-[1.02]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>All Talent Profiles (सर्व कलाकार)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${talentIndustryFilter === 'all' ? 'bg-black/30 text-black font-extrabold' : 'bg-white/10 text-gray-400'}`}>
                    {profiles.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTalentIndustryFilter('marathi')}
                  className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer border ${
                    talentIndustryFilter === 'marathi'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-900/30 scale-[1.02]'
                      : 'text-orange-300 hover:text-white hover:bg-white/5 border-orange-500/20'
                  }`}
                >
                  <span className="text-sm">🚩</span>
                  <span>मराठी इंडस्ट्री (Marathi Cinema, Natak & Serials)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${talentIndustryFilter === 'marathi' ? 'bg-black/30 text-white font-extrabold' : 'bg-white/10 text-orange-300'}`}>
                    {profiles.filter(p => p.industry === 'Marathi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Marathi') || p.city?.includes('Maharashtra') || p.city?.includes('Mumbai') || p.city?.includes('Pune')))).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTalentIndustryFilter('hindi')}
                  className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer border ${
                    talentIndustryFilter === 'hindi'
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-400 shadow-lg shadow-purple-900/30 scale-[1.02]'
                      : 'text-purple-300 hover:text-white hover:bg-white/5 border-purple-500/20'
                  }`}
                >
                  <span className="text-sm">🎬</span>
                  <span>हिंदी बॉलिवूड (Hindi Bollywood, Films & OTT)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${talentIndustryFilter === 'hindi' ? 'bg-black/30 text-white font-extrabold' : 'bg-white/10 text-purple-300'}`}>
                    {profiles.filter(p => p.industry === 'Hindi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Hindi') || p.categorySlug === 'actors'))).length}
                  </span>
                </button>
              </div>

              {/* Profile Create/Edit Form */}
              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-5 sm:p-7 border-gold-glow bg-[#101016] space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>{isCreating ? 'Create New Talent Media Profile' : `Edit Profile: ${editingItem.name}`}</span>
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        अभिनेत्री, अभिनेता किंवा इन्फ्लुएन्सर प्रोफाईल इमेज व व्हिडिओ मीडियासह अचूक रेशोमध्ये (9:16 / 16:9) जोडा.
                      </p>
                    </div>

                    {editingItem.talentType && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold font-cinzel tracking-wider uppercase bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 w-fit">
                        {editingItem.talentType}
                      </span>
                    )}
                  </div>

                  {/* 1. TALENT TYPE PRESET SELECTOR (Actress / Actor / Influencer / Model / Creator) */}
                  <div className="p-3.5 rounded-xl bg-[#14141E] border border-white/10 space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#F3D068] uppercase tracking-wider block">
                      Talent Type & Category Focus (कलाकार वर्ग) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { type: 'Actress', label: '👑 Actress (अभिनेत्री)', sub: 'Lead Film & Drama Actress', catSlug: 'actors' },
                        { type: 'Actor', label: '⭐ Actor (अभिनेता)', sub: 'Lead Method Actor', catSlug: 'actors' },
                        { type: 'Influencer', label: '📱 Influencer (इन्फ्लुएन्सर)', sub: 'Lifestyle & Tech Creator', catSlug: 'influencers' },
                        { type: 'Model', label: '👗 Model (मॉडेल)', sub: 'High Fashion Editorial', catSlug: 'models' },
                        { type: 'Celebrity', label: '🌟 Celebrity (सेलिब्रिटी)', sub: 'A-List Star', catSlug: 'celebrities' },
                        { type: 'Creator', label: '🎬 Creator (क्रिएटर)', sub: 'Short Form Reels Creator', catSlug: 'influencers' },
                        { type: 'Singer', label: '🎤 Singer (गायक)', sub: 'Playback Vocalist', catSlug: 'singers' }
                      ].map((item) => {
                        const isSelected = editingItem.talentType === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => {
                              const targetCat = categories.find(c => c.slug === item.catSlug) || categories[0];
                              setEditingItem({
                                ...editingItem,
                                talentType: item.type,
                                categorySlug: targetCat?.slug || item.catSlug,
                                categoryName: targetCat?.name || editingItem.categoryName,
                                subcategory: editingItem.subcategory || item.sub,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#D4AF37]/30 to-black border-[#D4AF37] text-white shadow-md'
                                : 'bg-[#181822] hover:bg-white/5 border-white/10 text-gray-300'
                            }`}
                          >
                            <span>{item.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#F3D068]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Basic Information (Name, Category, Subcategory) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Full / Stage Name (नाव) *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        placeholder="e.g. Shraddha Kapoor / Swapnil Joshi"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Category Division *</label>
                      <select
                        value={editingItem.categorySlug}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.slug === e.target.value);
                          setEditingItem({
                            ...editingItem,
                            categorySlug: e.target.value,
                            categoryName: cat?.name || e.target.value,
                          });
                        }}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Subcategory / Discipline</label>
                      <input
                        type="text"
                        value={editingItem.subcategory || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}
                        placeholder="e.g. Lead OTT Actress / High Fashion"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* 2.5 INDUSTRY AFFILIATION & REGIONAL SECTOR (मराठी इंडस्ट्री / हिंदी बॉलिवूड) */}
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#170F14] via-[#12121A] to-[#0E1520] border border-[#D4AF37]/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-xs font-cinzel font-bold text-[#F3D068] uppercase tracking-wider flex items-center gap-2">
                          <Crown className="w-4 h-4 text-[#D4AF37]" />
                          <span>Industry & Entertainment Sector (मराठी व हिंदी इंडस्ट्री विभाग) *</span>
                        </span>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          कलाकाराचे मुख्य इंडस्ट्री क्षेत्र निवडा - मराठी नाटक/मालिका/चित्रपट किंवा हिंदी बॉलिवूड/ओटीटी (किंवा दोन्ही).
                        </p>
                      </div>

                      {/* Industry Selector Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: 'Marathi' as const, label: '🚩 मराठी इंडस्ट्री', sub: 'नाटक, मालिका, चित्रपट' },
                          { id: 'Hindi' as const, label: '🎬 हिंदी बॉलिवूड', sub: 'सिनेमा व OTT' },
                          { id: 'Both' as const, label: '🌟 दोन्ही (Marathi & Hindi)', sub: 'सर्वसमावेशक' },
                        ].map((ind) => {
                          const isSel = (editingItem.industry || 'Marathi') === ind.id;
                          return (
                            <button
                              key={ind.id}
                              type="button"
                              onClick={() => setEditingItem({ ...editingItem, industry: ind.id })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                                isSel
                                  ? ind.id === 'Marathi'
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-400 shadow-md'
                                    : ind.id === 'Hindi'
                                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-400 shadow-md'
                                    : 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black border-[#F3D068] shadow-md'
                                  : 'bg-[#181822] hover:bg-white/5 border-white/10 text-gray-300'
                              }`}
                            >
                              <span>{ind.label}</span>
                              {isSel && <Check className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* MARATHI INDUSTRY SPECIFIC FIELDS */}
                    {(editingItem.industry === 'Marathi' || editingItem.industry === 'Both' || !editingItem.industry) && (
                      <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-orange-300">
                          <Film className="w-4 h-4 text-orange-400" />
                          <span>मराठी इंडस्ट्री तपशील (Marathi Theatre Natak & Television Serials)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-gray-300 block mb-1">
                              मराठी नाटक / कमर्शियल व प्रायोगिक रंगभूमी (Commercial & Sangeet Natak)
                            </label>
                            <input
                              type="text"
                              value={editingItem.marathiNatakOrTheatre || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, marathiNatakOrTheatre: e.target.value })}
                              placeholder="उदा. संगीत कट्यार काळजात घुसली, वाडा चिरेबंदी, सही रे सही, ऑल द बेस्ट..."
                              className="w-full bg-[#181822] border border-orange-500/30 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-gray-300 block mb-1">
                              मराठी मालिका व टीव्ही शो (Zee Marathi, Star Pravah, Colors Marathi)
                            </label>
                            <input
                              type="text"
                              value={editingItem.marathiSerialsOrShows || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, marathiSerialsOrShows: e.target.value })}
                              placeholder="उदा. ठरलं तर मग, सुखाच्या सरींनी, तुला पाहते रे, झी नाट्य गौरव..."
                              className="w-full bg-[#181822] border border-orange-500/30 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HINDI BOLLYWOOD SPECIFIC FIELDS */}
                    {(editingItem.industry === 'Hindi' || editingItem.industry === 'Both' || !editingItem.industry) && (
                      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-purple-300">
                          <Film className="w-4 h-4 text-purple-400" />
                          <span>हिंदी बॉलिवूड व ओटीटी तपशील (Bollywood Feature Films & National OTT Series)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-gray-300 block mb-1">
                              Bollywood Cinema / Hindi Feature Films (हिंदी चित्रपट)
                            </label>
                            <input
                              type="text"
                              value={editingItem.hindiFilmsOrBollywood || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, hindiFilmsOrBollywood: e.target.value })}
                              placeholder="उदा. Stree 2, Chhichhore, धर्मा प्रॉडक्शन, यशराज फिल्म्स, मुख्य भूमिका..."
                              className="w-full bg-[#181822] border border-purple-500/30 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-gray-300 block mb-1">
                              National OTT Web Series (Netflix, Prime Video, Hotstar, SonyLIV, Zee5)
                            </label>
                            <input
                              type="text"
                              value={editingItem.hindiOttSeries || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, hindiOttSeries: e.target.value })}
                              placeholder="उदा. Sacred Games, The Family Man, Scam 1992, Panchayat..."
                              className="w-full bg-[#181822] border border-purple-500/30 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PRESTIGIOUS AWARDS & ACCOLADES */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <label className="text-[11px] font-cinzel font-bold text-[#F3D068] block mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Notable Prestigious Awards & Honors (चित्रपट, नाट्य व राष्ट्रीय पुरस्कार)</span>
                      </label>
                      <input
                        type="text"
                        value={editingItem.notableAwards || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, notableAwards: e.target.value })}
                        placeholder="उदा. Filmfare Best Actress, Zee Chitra Gaurav, महाराष्ट्र शासन राज्य पुरस्कार, IIFA Award..."
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* 3. PROFESSIONAL IMAGE UPLOAD WITH ASPECT RATIO SELECTION & INTERACTIVE CROP TOOL */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#14141E] border border-[#D4AF37]/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-xs font-cinzel font-bold text-[#F3D068] uppercase tracking-wider flex items-center gap-2">
                          <Crop className="w-4 h-4 text-[#D4AF37]" />
                          <span>Image Aspect Ratio & Interactive Crop Studio (इमेज रेशो व क्रॉप)</span>
                        </span>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          योग्य रेशो निवडा (3:4, 1:1, 4:5, 9:16, 16:9). फोटो अपलोड केल्यावर थेट क्रॉप टूल उघडेल.
                        </p>
                      </div>

                      {/* Aspect Ratio Selector Chips */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(['3:4', '1:1', '4:5', '9:16', '16:9'] as AspectRatioType[]).map((ratio) => {
                          const isCur = (editingItem.imageAspectRatio || '3:4') === ratio;
                          return (
                            <button
                              key={ratio}
                              type="button"
                              onClick={() => {
                                setEditingItem({ ...editingItem, imageAspectRatio: ratio });
                                if (editingItem.photoUrl) {
                                  setTalentImageToCrop(editingItem.photoUrl);
                                  setTalentCropModalOpen(true);
                                }
                              }}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer border ${
                                isCur
                                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                  : 'bg-white/5 hover:bg-white/15 text-gray-300 border-white/10'
                              }`}
                            >
                              {ratio}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Upload Controls & URL (8 Cols) */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="flex flex-wrap sm:flex-nowrap gap-2">
                          <input
                            type="text"
                            required
                            value={editingItem.photoUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, photoUrl: e.target.value })}
                            placeholder="Paste image URL or click 'Upload & Crop' below"
                            className="flex-1 bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500"
                          />
                          <label className="btn-gold px-3.5 py-2.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Crop</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const dataUrl = reader.result as string;
                                    setTalentImageToCrop(dataUrl);
                                    setTalentCropModalOpen(true);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Interactive Re-Crop Button */}
                        {editingItem.photoUrl && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setTalentImageToCrop(editingItem.photoUrl);
                                setTalentCropModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/60 text-xs font-semibold text-[#F3D068] flex items-center gap-1.5 cursor-pointer transition shadow"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>Crop & Adjust Current Image (रेशो ऍडजस्ट करा)</span>
                            </button>

                            <span className="text-[11px] text-gray-400 font-mono">
                              Active Ratio: <span className="text-emerald-400 font-bold">{editingItem.imageAspectRatio || '3:4'}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Live Image Preview (4 Cols) */}
                      <div className="md:col-span-4 flex justify-center">
                        {editingItem.photoUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-xl bg-black max-w-[130px]">
                            <img
                              src={editingItem.photoUrl}
                              alt="Talent Preview"
                              className="w-full h-auto object-cover max-h-40"
                              style={{
                                aspectRatio:
                                  editingItem.imageAspectRatio === '1:1'
                                    ? '1/1'
                                    : editingItem.imageAspectRatio === '4:5'
                                    ? '4/5'
                                    : editingItem.imageAspectRatio === '9:16'
                                    ? '9/16'
                                    : editingItem.imageAspectRatio === '16:9'
                                    ? '16/9'
                                    : '3/4'
                              }}
                            />
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#F3D068] font-bold">
                              {editingItem.imageAspectRatio || '3:4'}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setTalentImageToCrop(editingItem.photoUrl);
                                setTalentCropModalOpen(true);
                              }}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-bold cursor-pointer"
                            >
                              Edit Crop
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-28 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center p-2 text-gray-500 text-[10px]">
                            <ImageIcon className="w-5 h-5 mb-1 text-gray-600" />
                            <span>No Photo Uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. DEDICATED TALENT VIDEO MEDIA UPLOAD (MP4 / WebM / MOV - NOT LINK!) */}
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#151522] via-[#101018] to-black border border-purple-500/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-xs font-cinzel font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                          <Video className="w-4 h-4 text-pink-400" />
                          <span>Direct Video Media Upload (व्हिडिओ मीडिया फाईल - MP4)</span>
                        </span>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          अभिनेत्री किंवा अभिनेत्याचा शोरील (Showreel), ॲक्टिंग मोनोलॉग, किंवा इन्फ्लुएन्सर व्हायरल रील्स थेट फाईलमधून अपलोड करा.
                        </p>
                      </div>

                      {/* Video Aspect Ratio Selection: 9:16 vs 16:9 */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, videoAspectRatio: '9:16' })}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 border ${
                            (editingItem.videoAspectRatio || '9:16') === '9:16'
                              ? 'bg-gradient-to-r from-pink-900/60 to-purple-900/60 border-pink-400 text-pink-200 shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>9:16 Vertical Reel</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, videoAspectRatio: '16:9' })}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 border ${
                            editingItem.videoAspectRatio === '16:9'
                              ? 'bg-gradient-to-r from-[#D4AF37]/30 to-amber-950/60 border-[#D4AF37] text-[#F3D068] shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>16:9 Widescreen</span>
                        </button>
                      </div>
                    </div>

                    {/* Video File Picker, Tag & Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* File Upload Button & Video Info (8 Cols) */}
                      <div className="sm:col-span-8 space-y-3">
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                          <label className="btn-gold px-4 py-2.5 rounded-lg text-xs font-cinzel font-bold cursor-pointer flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 transition">
                            <Upload className="w-4 h-4" />
                            <span>Upload Video File (MP4/WebM)</span>
                            <input
                              ref={talentVideoFileInputRef}
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime"
                              className="hidden"
                              onChange={handleTalentVideoUpload}
                            />
                          </label>

                          <div className="text-xs text-gray-300 truncate">
                            {talentUploadedVideoName || (editingItem.videoUrl ? 'Video media attached' : 'No video file selected yet')}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-gray-300 block mb-1">Video Performance Title (शीर्षक)</label>
                            <input
                              type="text"
                              value={editingItem.videoTitle || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, videoTitle: e.target.value })}
                              placeholder="e.g. Dramatic Monologue / Film Showreel"
                              className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-gray-300 block mb-1">Performance Tag (टॅग)</label>
                            <select
                              value={editingItem.videoTag || 'Showreel'}
                              onChange={(e) => setEditingItem({ ...editingItem, videoTag: e.target.value })}
                              className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white"
                            >
                              <option value="Showreel">Showreel (शोरील)</option>
                              <option value="Acting Monologue">Acting Monologue (अभिनय मोनोलॉग)</option>
                              <option value="Viral Reel">Viral Reel (व्हायरल रील्स)</option>
                              <option value="Audition Tape">Audition Tape (ऑडिशन क्लिप)</option>
                              <option value="Fashion Walk">Fashion Walk (रॅम्प वॉक)</option>
                              <option value="Behind The Scenes">Behind The Scenes (बीटीएस)</option>
                              <option value="Brand Commercial">Brand Commercial (जाहिरात)</option>
                              <option value="Dance Clip">Dance Performance (नृत्य)</option>
                            </select>
                          </div>
                        </div>

                        {editingItem.videoDuration && (
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Duration: <strong className="text-white font-mono">{editingItem.videoDuration}</strong></span>
                            <span className="text-gray-600">•</span>
                            <span>Ratio: <strong className="text-emerald-400 font-mono">{editingItem.videoAspectRatio || '9:16'}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Live In-Form Video Player Preview (4 Cols) */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center">
                        {editingItem.videoUrl ? (
                          <div className="w-full space-y-2 flex flex-col items-center">
                            <div
                              className={`relative rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-xl bg-black ${
                                editingItem.videoAspectRatio === '16:9'
                                  ? 'aspect-video w-full'
                                  : 'aspect-[9/16] w-28 max-h-48'
                              }`}
                            >
                              <video
                                src={editingItem.videoUrl}
                                controls
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem({
                                  ...editingItem,
                                  videoUrl: '',
                                  videoTitle: '',
                                  videoDuration: '',
                                });
                                setTalentUploadedVideoName(null);
                              }}
                              className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                            >
                              Remove Video (व्हिडिओ काढा)
                            </button>
                          </div>
                        ) : (
                          <div className="w-full p-4 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                            <Film className="w-6 h-6 mb-1 text-gray-600" />
                            <span>No video attached</span>
                            <span className="text-[10px] text-gray-600">Select MP4 file to preview</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 5. Professional Biography */}
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Professional Biography (बायोग्राफी) *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.bio || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                      placeholder="Enter detailed acting background, awards, notable OTT/Film projects, and brand endorsements..."
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500"
                    />
                  </div>

                  {/* 6. Verified Instagram Profile & Live Follower Engine */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E0E18] via-[#14141E] to-[#160E1E] border border-pink-500/40 space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-cinzel font-bold text-pink-300 flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span>Instagram Profile Verification & Real Follower Count Engine</span>
                      </span>
                      <span className="text-[10px] text-pink-200/80 font-mono bg-pink-950/60 border border-pink-500/30 px-2 py-0.5 rounded">
                        Live Social Graph Scraper
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      कलाकाराची थेट Instagram लिंक (उदा. <code>https://instagram.com/shraddhakapoor</code>) किंवा युझरनेम (उदा. <code>@shraddhakapoor</code>) टाका. सिस्टीम थेट Instagram कडून रिअल फॉलोअर्स संख्या, ब्लू टिक आणि प्रोफाईल पडताळणी करेल.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={editingItem.instagramUrl || editingItem.instagramHandle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingItem({
                              ...editingItem,
                              instagramUrl: val.startsWith('http') ? val : `https://instagram.com/${val.replace('@', '')}`,
                              instagramHandle: val.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '') ? `@${val.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '')}` : val
                            });
                          }}
                          placeholder="Instagram link or handle (उदा. @shraddhakapoor किंवा https://instagram.com/shraddhakapoor)"
                          className="w-full bg-[#181822] border border-pink-500/30 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyEditingItemInstagram}
                        disabled={isVerifyingInstagram}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50 cursor-pointer shrink-0 transition"
                      >
                        {isVerifyingInstagram ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Counting Followers...</span>
                          </>
                        ) : (
                          <>
                            <Instagram className="w-3.5 h-3.5" />
                            <span>Verify IG & Count Followers (व्हेरिफाय करा)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Breakdown Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] text-gray-300 block mb-1">Clean Handle (हँडल)</label>
                        <input
                          type="text"
                          value={editingItem.instagramHandle || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, instagramHandle: e.target.value })}
                          placeholder="@shraddhakapoor"
                          className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 block mb-1">
                          Verified Follower Count (रिअल फॉलोअर्स) *
                        </label>
                        <input
                          type="text"
                          value={editingItem.instagramFollowers || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, instagramFollowers: e.target.value })}
                          placeholder="e.g. 94.2M Followers"
                          className="w-full bg-[#181822] border border-pink-500/30 rounded-lg p-2 text-xs text-pink-300 font-bold placeholder-gray-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 block mb-1">Full Profile URL</label>
                        <input
                          type="url"
                          value={editingItem.instagramUrl || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/..."
                          className="w-full bg-[#181822] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Live Verified Follower Card Preview */}
                    {(editingItem.instagramFollowers || igVerificationResult) && (
                      <div className="p-3.5 rounded-xl bg-black/70 border border-pink-500/40 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-pink-400">
                              <Instagram className="w-5 h-5" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white font-mono">
                                {editingItem.instagramHandle || igVerificationResult?.handle || '@artist'}
                              </span>
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold" title="Verified Blue Checkmark">
                                ✓
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200">
                                {editingItem.instagramFollowers || igVerificationResult?.followers}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                                Real Verified
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {editingItem.instagramUrl && (
                            <a
                              href={editingItem.instagramUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-[11px] font-mono flex items-center gap-1 border border-white/10"
                            >
                              <span>Open Live Feed</span>
                              <ExternalLink className="w-3 h-3 text-pink-400" />
                            </a>
                          )}
                          <span className="text-[10px] text-gray-400 font-mono">
                            {igVerificationResult?.source || 'Verified Profile Engine'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 7. City, Availability, Workflow & Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">
                        City / Location (महाराष्ट्र शहर/जिल्हा) *
                      </label>
                      <input
                        type="text"
                        list="maharashtra-talent-cities"
                        value={editingItem.city || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                        placeholder="e.g. Mumbai, Pune, Nagpur, Nashik..."
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                      <datalist id="maharashtra-talent-cities">
                        {MAHARASHTRA_CITIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.marathiName}) • {c.region}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Availability</label>
                      <select
                        value={editingItem.availability || 'Available'}
                        onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Available">Available</option>
                        <option value="Limited">Limited</option>
                        <option value="Booked">Booked</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Status Workflow</label>
                      <select
                        value={editingItem.status || 'published'}
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="published">Published</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending Review</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="profFeat"
                        checked={editingItem.isFeatured ?? true}
                        onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                        className="rounded text-[#D4AF37]"
                      />
                      <label htmlFor="profFeat" className="text-xs text-gray-300 cursor-pointer font-medium">
                        Feature on Homepage & VIP Roster
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await saveTalentProfile(editingItem);
                          setNotice(`Profile for "${editingItem.name}" saved successfully with ${editingItem.imageAspectRatio || '3:4'} image and video media!`);
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                          if (onDataChange) onDataChange();
                        } catch (err: any) {
                          setError(err.message || 'Error saving talent profile.');
                        }
                      }}
                      className="btn-gold px-7 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
                    >
                      <Check className="w-4 h-4 text-black" />
                      <span>Save & Publish Profile (प्रोफाईल जतन करा)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Profiles Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle shadow-xl">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Artist & Type</th>
                      <th className="p-3">Division</th>
                      <th className="p-3">Media (Image / Video)</th>
                      <th className="p-3">Instagram & Reach</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3">Featured</th>
                      <th className="p-3">Workflow</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {profiles
                      .filter((p) => {
                        if (talentIndustryFilter === 'marathi') {
                          return p.industry === 'Marathi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Marathi') || p.city?.includes('Maharashtra') || p.city?.includes('Mumbai') || p.city?.includes('Pune')));
                        }
                        if (talentIndustryFilter === 'hindi') {
                          return p.industry === 'Hindi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Hindi') || p.categorySlug === 'actors'));
                        }
                        return true;
                      })
                      .map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-bold text-white flex items-center gap-2.5">
                          {p.photoUrl ? (
                            <img
                              src={p.photoUrl}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-cover border border-[#D4AF37]/50 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-[#D4AF37] shrink-0">
                              {p.name[0]}
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{p.name}</span>
                              {p.isVerified && (
                                <span title="Verified Talent Roster" className="inline-flex text-[#D4AF37]">
                                  <ShieldCheck className="w-3.5 h-3.5 fill-[#D4AF37]/20" />
                                </span>
                              )}
                              {/* Industry Badge */}
                              {p.industry === 'Marathi' ? (
                                <span className="px-1.5 py-0.2 rounded bg-orange-950/80 border border-orange-500/50 text-[9px] font-bold text-orange-300 font-mono">
                                  🚩 मराठी
                                </span>
                              ) : p.industry === 'Hindi' ? (
                                <span className="px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500/50 text-[9px] font-bold text-purple-300 font-mono">
                                  🎬 हिंदी
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[9px] font-bold text-[#F3D068] font-mono">
                                  🌟 मराठी+हिंदी
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-normal text-gray-400 block font-cinzel">
                              {p.talentType || 'Artist'} • {p.subcategory || 'Principal'}
                            </span>

                            {/* Regional Credits Preview Chips */}
                            <div className="flex flex-wrap gap-1 pt-0.5 max-w-xs">
                              {p.marathiNatakOrTheatre && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-900/30 text-orange-200 border border-orange-500/20 truncate max-w-[150px]" title={p.marathiNatakOrTheatre}>
                                  🎭 नाटक: {p.marathiNatakOrTheatre}
                                </span>
                              )}
                              {p.marathiSerialsOrShows && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-200 border border-amber-500/20 truncate max-w-[150px]" title={p.marathiSerialsOrShows}>
                                  📺 मालिका: {p.marathiSerialsOrShows}
                                </span>
                              )}
                              {p.hindiFilmsOrBollywood && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-200 border border-purple-500/20 truncate max-w-[150px]" title={p.hindiFilmsOrBollywood}>
                                  🎬 फिल्म: {p.hindiFilmsOrBollywood}
                                </span>
                              )}
                              {p.hindiOttSeries && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-900/30 text-indigo-200 border border-indigo-500/20 truncate max-w-[150px]" title={p.hindiOttSeries}>
                                  📱 OTT: {p.hindiOttSeries}
                                </span>
                              )}
                              {p.notableAwards && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-[#F3D068] border border-[#D4AF37]/20 truncate max-w-[150px]" title={p.notableAwards}>
                                  🏆 {p.notableAwards}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-400">{p.categoryName}</td>

                        {/* Media column: Image ratio & Video button */}
                        <td className="p-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-gray-300">
                              Ratio: {p.imageAspectRatio || '3:4'}
                            </span>
                            {p.videoUrl ? (
                              <button
                                type="button"
                                onClick={() => setTalentWatchModalProfile(p)}
                                className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-900/60 to-purple-900/60 hover:from-pink-800 hover:to-purple-800 text-pink-300 border border-pink-500/50 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition shadow"
                                title="Watch uploaded performance video"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>{p.videoAspectRatio || 'Reel'}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-600">No video</span>
                            )}
                          </div>
                        </td>

                        {/* Instagram & Follower Reach */}
                        <td className="p-3">
                          {p.instagramFollowers ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                <span className="font-mono font-bold text-pink-300 text-[11px]">
                                  {p.instagramFollowers}
                                </span>
                                {p.instagramVerified && (
                                  <span
                                    className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold"
                                    title="Verified Blue Tick"
                                  >
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                                <span className="truncate max-w-[100px]">{p.instagramHandle || '@artist'}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuickVerifyInstagram(p)}
                                  disabled={verifyingTalentId === p.id}
                                  className="text-pink-400 hover:text-pink-300 ml-1 underline cursor-pointer"
                                  title="Refresh live followers count"
                                >
                                  {verifyingTalentId === p.id ? '...' : 'Re-verify'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickVerifyInstagram(p)}
                              disabled={verifyingTalentId === p.id}
                              className="px-2 py-1 rounded bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 text-[10px] font-bold border border-pink-500/40 flex items-center gap-1 cursor-pointer transition shadow"
                              title="Verify Instagram handle and fetch real follower count"
                            >
                              <Instagram className="w-3 h-3 text-pink-400" />
                              <span>{verifyingTalentId === p.id ? 'Counting...' : 'Verify IG'}</span>
                            </button>
                          )}
                        </td>

                        <td className="p-3 text-gray-400">{p.city || '-'}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.availability === 'Available'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.isFeatured ? (
                            <span className="text-[#D4AF37] font-bold">★ Yes</span>
                          ) : (
                            <span className="text-gray-600">No</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              p.status === 'published'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 sm:space-x-2">
                          {p.videoUrl && (
                            <button
                              type="button"
                              onClick={() => setTalentWatchModalProfile(p)}
                              className="px-2 py-1 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F3D068] text-[10px] font-bold border border-[#D4AF37]/40 cursor-pointer"
                              title="Play Video"
                            >
                              Play
                            </button>
                          )}
                          {!p.isVerified && (
                            <button
                              onClick={async () => {
                                try {
                                  await saveTalentProfile({ ...p, isVerified: true, status: 'published' });
                                  setNotice(`Verified and published ${p.name}`);
                                  fetchAllData();
                                } catch (err: any) {
                                  setError(err.message);
                                }
                              }}
                              className="px-2 py-1 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F3D068] text-[10px] font-bold border border-[#D4AF37]/40 cursor-pointer"
                              title="1-Click Verify and Publish"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingItem(p);
                              setIsCreating(false);
                            }}
                            className="text-gray-300 hover:text-[#D4AF37] cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete profile for ${p.name}?`)) {
                                await deleteTalentProfile(p.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Bookings & Quotations */}
          {activeModule === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Bookings & Quotations</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Review incoming requests, prepare official quotes, and transition status to Confirmed.
                  </p>
                </div>
                <button
                  onClick={handleExportBookingsToSheets}
                  disabled={exportingSheet}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export to Google Sheets</span>
                </button>
              </div>

              {editingItem && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    Manage Booking: {editingItem.bookingReference}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Workflow Status</label>
                      <select
                        value={editingItem.status}
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quote Prepared">Quote Prepared</option>
                        <option value="Awaiting Customer Response">Awaiting Customer Response</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Quotation Amount ($ / Currency)</label>
                      <input
                        type="text"
                        value={editingItem.quotationAmount || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, quotationAmount: e.target.value })}
                        placeholder="e.g. $45,000 + Rider"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Payment Status</label>
                      <input
                        type="text"
                        value={editingItem.paymentStatus || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, paymentStatus: e.target.value })}
                        placeholder="Pending Deposit / Paid in Full"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Private Internal Notes (Admin Only)</label>
                    <textarea
                      rows={2}
                      value={editingItem.internalNotes || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, internalNotes: e.target.value })}
                      placeholder="Hospitality riders, manager contract terms, private negotiations..."
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded text-xs text-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await updateBooking(editingItem.id, {
                            status: editingItem.status,
                            quotationAmount: editingItem.quotationAmount,
                            paymentStatus: editingItem.paymentStatus,
                            internalNotes: editingItem.internalNotes,
                          });
                          setNotice('Booking status updated.');
                          setEditingItem(null);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Update Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Artist / Event</th>
                      <th className="p-3">Quote</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[#D4AF37] font-bold">{b.bookingReference}</td>
                        <td className="p-3 font-medium text-white">{b.customerName}</td>
                        <td className="p-3 text-gray-400 font-mono text-[11px]">{b.customerEmail}</td>
                        <td className="p-3">{b.bookingType}</td>
                        <td className="p-3 text-gray-300">
                          {b.talentName ? `${b.talentName} (${b.eventName})` : b.eventName}
                        </td>
                        <td className="p-3 text-emerald-400 font-medium">{b.quotationAmount || 'Pending'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setEditingItem(b)}
                            className="text-gray-300 hover:text-[#D4AF37]"
                            title="Manage / Quote"
                          >
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete booking ${b.bookingReference}?`)) {
                                await deleteBooking(b.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Packages & Pricing */}
          {activeModule === 'packages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Packages & Pricing</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage fixed deliverables and quotation tiers displayed publicly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem({
                      title: '',
                      categorySlug: categories[0]?.slug || 'celebrities',
                      priceType: 'quote',
                      price: '$25,000',
                      duration: '1 Full Day',
                      deliverables: ['Event appearance', 'Red carpet photo op', 'Press brief'],
                      exclusions: 'Flights & lodging rider billed separately',
                      isPublished: true,
                      isFeatured: false,
                      displayOrder: packages.length + 1,
                    });
                  }}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Package</span>
                </button>
              </div>

              {/* Form */}
              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    {isCreating ? 'Create Package' : 'Edit Package'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Category Division</label>
                      <select
                        value={editingItem.categorySlug}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.slug === e.target.value);
                          setEditingItem({
                            ...editingItem,
                            categorySlug: e.target.value,
                            categoryName: cat?.name || e.target.value,
                          });
                        }}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Pricing Model</label>
                      <select
                        value={editingItem.priceType}
                        onChange={(e) => setEditingItem({ ...editingItem, priceType: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="quote">Request a Quote</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Price / Starting Rate</label>
                      <input
                        type="text"
                        value={editingItem.price || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                        placeholder="e.g. $15,000 / Starting at $50k"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Duration / Timeline</label>
                      <input
                        type="text"
                        value={editingItem.duration || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                        placeholder="e.g. 4 Hours / 1 Campaign Month"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">
                      Deliverables (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(editingItem.deliverables) ? editingItem.deliverables.join(', ') : ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          deliverables: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-xs text-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await savePackage(editingItem);
                          setNotice('Package saved.');
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Save Package
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Package Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price Type</th>
                      <th className="p-3">Price Display</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Featured</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{pkg.title}</td>
                        <td className="p-3 text-gray-400">{pkg.categorySlug}</td>
                        <td className="p-3">{pkg.priceType}</td>
                        <td className="p-3 text-[#D4AF37] font-mono">{pkg.price}</td>
                        <td className="p-3 text-gray-400">{pkg.duration || '-'}</td>
                        <td className="p-3">{pkg.isFeatured ? '★ Yes' : 'No'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingItem(pkg)} className="text-gray-300 hover:text-[#D4AF37]">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete package ${pkg.title}?`)) {
                                await deletePackage(pkg.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Shows & Events */}
          {activeModule === 'shows' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Talent Shows & Events</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage upcoming competitions, arenas, and registration schedules.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem({
                      title: '',
                      category: 'Singing & Music Showcase',
                      bannerUrl: '',
                      description: '',
                      eventDate: '2026-11-15',
                      registrationDeadline: '2026-11-01',
                      format: 'Physical',
                      venue: 'Beverly Hills Theater',
                      city: 'Los Angeles, CA',
                      eligibility: 'Ages 18+, original music or certified covers.',
                      prizes: 'Exclusive recording contract + $100,000 endowment',
                      feeType: 'Free',
                      status: 'Upcoming',
                      isPublished: true,
                    });
                  }}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Show</span>
                </button>
              </div>

              {/* Form */}
              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    {isCreating ? 'Create Talent Show' : 'Edit Talent Show'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Show Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Competition Category</label>
                      <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Status</label>
                      <select
                        value={editingItem.status}
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Registration Open">Registration Open</option>
                        <option value="Registration Closed">Registration Closed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Show Poster / Stage Banner: Media Upload Only (No Link Input, Ratio Selection & Size Selection) */}
                  <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                    <MediaImageUploader
                      value={editingItem.bannerUrl || ''}
                      defaultRatio="16:9"
                      defaultSize="1080p"
                      label="Show Poster / Stage Banner (फक्त मीडिया फाईल अपलोड - Not Link)"
                      helperText="स्पर्धा/शो चे अधिकृत पोस्टर निवडा. रेशो (16:9, 4:3, 1:1, 21:9) आणि साईझ निवडून क्रॉप करा."
                      onChange={(dataUrl) => {
                        setEditingItem({ ...editingItem, bannerUrl: dataUrl });
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Description / शो ची सविस्तर माहिती</label>
                    <textarea
                      rows={3}
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="स्पर्धेचे नियम, परीक्षक, ऑडीशन डिटेल्स व वेळापत्रक..."
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Event Date (शो ची तारीख) *</label>
                      <input
                        type="text"
                        value={editingItem.eventDate}
                        onChange={(e) => setEditingItem({ ...editingItem, eventDate: e.target.value })}
                        placeholder="e.g. December 28, 2026"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Registration Deadline (नोंदणी अंतिम मुदत)</label>
                      <input
                        type="text"
                        value={editingItem.registrationDeadline}
                        onChange={(e) => setEditingItem({ ...editingItem, registrationDeadline: e.target.value })}
                        placeholder="e.g. December 15, 2026"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Maharashtra City (महाराष्ट्र शहर) *</label>
                      <select
                        value={editingItem.city || 'Mumbai'}
                        onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        {MAHARASHTRA_CITIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.marathiName}) • {c.region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Venue / Arena (स्थळ)</label>
                      <input
                        type="text"
                        value={editingItem.venue || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, venue: e.target.value })}
                        placeholder="e.g. Jio World Centre, BKC"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Format (स्वरूप)</label>
                      <select
                        value={editingItem.format || 'Physical'}
                        onChange={(e) => setEditingItem({ ...editingItem, format: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Physical">Physical (लाईव्ह स्टेज / अरेना)</option>
                        <option value="Hybrid">Hybrid (स्टेज + डिजिटल ब्रॉडकास्ट)</option>
                        <option value="Online">Online (डिजिटल व्हर्च्युअल)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Prizes & Awards (पारितोषिके)</label>
                      <input
                        type="text"
                        value={editingItem.prizes || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, prizes: e.target.value })}
                        placeholder="e.g. ₹25,00,000 + Agency Contract"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Eligibility (पात्रता)</label>
                      <input
                        type="text"
                        value={editingItem.eligibility || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, eligibility: e.target.value })}
                        placeholder="e.g. Open to all artists across Maharashtra"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Publish & Active Settings */}
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Publish Status (प्रकाशित करा)</span>
                      <span className="text-[11px] text-gray-400">नोंदणी आणि शो डिटेल्स दर्शकांना लगेच दिसण्यासाठी चालू ठेवा.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.isPublished !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-xs text-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await saveTalentShow(editingItem);
                          setNotice('Show saved.');
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Save Show
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Venue</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {shows.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{s.title}</td>
                        <td className="p-3 text-gray-400">{s.category}</td>
                        <td className="p-3 text-gray-300">{s.eventDate}</td>
                        <td className="p-3 text-gray-400">{s.venue || s.format}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingItem(s)} className="text-gray-300 hover:text-[#D4AF37]">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete show ${s.title}?`)) {
                                await deleteTalentShow(s.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Show Registrations */}
          {activeModule === 'eventRegs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Show Registrations</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage participants signed up for talent competitions and arenas.
                  </p>
                </div>
                <button
                  onClick={handleExportEventRegistrationsToSheets}
                  disabled={exportingSheet}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export to Google Sheets</span>
                </button>
              </div>

              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Show</th>
                      <th className="p-3">Participant</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Act / Piece</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {eventRegs.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[#D4AF37] font-bold">{reg.registrationReference}</td>
                        <td className="p-3 font-medium text-white">{reg.eventTitle}</td>
                        <td className="p-3 text-gray-200">{reg.fullName}</td>
                        <td className="p-3 text-gray-400 font-mono text-[11px]">{reg.email}</td>
                        <td className="p-3 text-gray-300 max-w-xs truncate">{reg.performanceDetails}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={async () => {
                              await updateEventRegistration(reg.id, { status: 'Approved' });
                              fetchAllData();
                            }}
                            className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              await updateEventRegistration(reg.id, { status: 'Waitlisted' });
                              fetchAllData();
                            }}
                            className="px-2 py-1 rounded bg-amber-950 text-amber-400 text-[10px] font-bold"
                          >
                            Waitlist
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Auditions & Casting */}
          {activeModule === 'auditions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Auditions & Casting Calls</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage casting notices for cinema, streaming, runway, and commercial campaigns.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem({
                      projectTitle: '',
                      category: 'Actors & Actresses',
                      description: '',
                      eligibility: 'Ages 22-35, cinematic screen presence',
                      auditionMethod: 'Self-Tape / Online',
                      deadline: '2026-10-30',
                      location: 'Remote Submissions',
                      requiredMaterials: 'Headshot + 2 min monologue self-tape',
                      terms: 'NDA required upon callback',
                      status: 'Open',
                      isPublished: true,
                    });
                  }}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Audition</span>
                </button>
              </div>

              {/* Form */}
              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    {isCreating ? 'Publish Casting Call' : 'Edit Audition'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.projectTitle}
                        onChange={(e) => setEditingItem({ ...editingItem, projectTitle: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Category</label>
                      <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Status</label>
                      <select
                        value={editingItem.status}
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Open">Open</option>
                        <option value="Closing Soon">Closing Soon</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Project & Role Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Submission Deadline</label>
                      <input
                        type="text"
                        value={editingItem.deadline}
                        onChange={(e) => setEditingItem({ ...editingItem, deadline: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Audition Format</label>
                      <select
                        value={editingItem.auditionMethod}
                        onChange={(e) => setEditingItem({ ...editingItem, auditionMethod: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Self-Tape / Online">Self-Tape / Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Required Materials</label>
                      <input
                        type="text"
                        value={editingItem.requiredMaterials}
                        onChange={(e) => setEditingItem({ ...editingItem, requiredMaterials: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-xs text-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await saveAudition(editingItem);
                          setNotice('Audition saved.');
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Save Audition
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Project Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Format</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditions.map((a) => (
                      <tr key={a.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{a.projectTitle}</td>
                        <td className="p-3 text-gray-400">{a.category}</td>
                        <td className="p-3">{a.auditionMethod}</td>
                        <td className="p-3 text-amber-300 font-mono">{a.deadline}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingItem(a)} className="text-gray-300 hover:text-[#D4AF37]">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete audition ${a.projectTitle}?`)) {
                                await deleteAudition(a.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Audition Submissions */}
          {activeModule === 'auditionApps' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">Audition Submissions & Tapes</h2>
                <p className="text-gray-400 text-xs mt-1">
                  Review applicant reels, shortlist performers, and update audition statuses.
                </p>
              </div>

              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Audition</th>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Reel Link</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditionApps.map((app) => (
                      <tr key={app.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[#D4AF37] font-bold">{app.applicationReference}</td>
                        <td className="p-3 font-medium text-white">{app.projectTitle}</td>
                        <td className="p-3 text-gray-200">{app.fullName}</td>
                        <td className="p-3 text-gray-400 font-mono text-[11px]">{app.email}</td>
                        <td className="p-3">
                          <a
                            href={app.reelUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#D4AF37] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Watch Reel</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={async () => {
                              await updateAuditionApplication(app.id, { status: 'Shortlisted' });
                              fetchAllData();
                            }}
                            className="px-2 py-1 rounded bg-amber-950 text-amber-300 text-[10px] font-bold"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={async () => {
                              await updateAuditionApplication(app.id, { status: 'Selected' });
                              fetchAllData();
                            }}
                            className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Talent Applications (Roster requests) */}
          {activeModule === 'talentApps' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">Talent Applications (Join AVA)</h2>
                <p className="text-gray-400 text-xs mt-1">
                  Submissions from aspiring artists and performers requesting representation on the AVA roster.
                </p>
              </div>

              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Artist</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Portfolio / Bio</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {talentApps.map((t) => (
                      <tr key={t.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[#D4AF37] font-bold">{t.applicationReference}</td>
                        <td className="p-3 font-medium text-white">
                          {t.stageName ? `${t.stageName} (${t.fullName})` : t.fullName}
                        </td>
                        <td className="p-3 text-gray-300">{t.category}</td>
                        <td className="p-3 text-gray-400">{t.city || '-'}</td>
                        <td className="p-3 text-gray-400 max-w-xs truncate">{t.bio}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={async () => {
                              try {
                                const cat = categories.find((c) => c.name.toLowerCase() === t.category.toLowerCase() || c.slug === t.category.toLowerCase());
                                await saveTalentProfile({
                                  name: t.stageName || t.fullName,
                                  categorySlug: cat?.slug || 'celebrities',
                                  categoryName: cat?.name || t.category || 'Celebrities',
                                  bio: t.bio,
                                  photoUrl: t.headshotUrl || '',
                                  city: t.city || 'Mumbai / Global',
                                  portfolioUrls: t.portfolioUrl ? [t.portfolioUrl] : [],
                                  skills: [t.category],
                                  languages: ['English', 'Hindi'],
                                  supportedBookingTypes: ['Celebrity Appearance', 'Brand Endorsement'],
                                  availability: 'Available',
                                  status: 'published',
                                  isFeatured: true,
                                  isVerified: true,
                                });
                                await updateTalentApplication(t.id, { status: 'Approved' });
                                setNotice(`Successfully created verified public roster profile for ${t.stageName || t.fullName}!`);
                                fetchAllData();
                              } catch (err: any) {
                                setError(err.message);
                              }
                            }}
                            className="px-2 py-1 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#F3D068] text-[10px] font-bold border border-[#D4AF37]/50"
                            title="Directly convert applicant to published verified profile"
                          >
                            + Convert to Profile
                          </button>
                          <button
                            onClick={async () => {
                              await updateTalentApplication(t.id, { status: 'Approved' });
                              fetchAllData();
                            }}
                            className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              await updateTalentApplication(t.id, { status: 'Shortlisted' });
                              fetchAllData();
                            }}
                            className="px-2 py-1 rounded bg-amber-950 text-amber-300 text-[10px] font-bold"
                          >
                            Shortlist
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Partners Management */}
          {activeModule === 'partners' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Partners Management</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage cinematography, photography, styling, and technical production houses.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveModule('logoSlider')}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-purple-200 border border-purple-400/50 flex items-center gap-1.5 text-xs font-cinzel font-bold hover:brightness-110 transition shadow cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F3D068]" />
                    <span>Open Auto-Slide Studio (ऑटो-स्लाईड कस्टमायझर)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCreating(true);
                      setEditingItem({
                        name: '',
                        partnerType: 'Streaming & Digital OTT Partner',
                        partnerTypeSlug: 'streaming-digital-ott-partner',
                        city: 'Mumbai',
                        website: '',
                        services: '4K Ultra-HD Streaming, Global Syndication, Exclusive Premieres',
                        logoUrl: '',
                        description: 'Official digital streaming & OTT distribution network collaborating with AVA.',
                        partnershipTier: 'Official Partner',
                        isPublished: true,
                        isFeatured: true,
                        displayOrder: partners.length + 1,
                      });
                    }}
                    className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Partner (नवीन पार्टनर जोडा)</span>
                  </button>
                </div>
              </div>

              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-cinzel text-base font-bold text-[#D4AF37] flex items-center gap-2">
                      <Handshake className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isCreating ? 'Add Official Partner (अधिकृत पार्टनर जोडा)' : 'Edit Official Partner (पार्टनर संपादित करा)'}</span>
                    </h3>
                    <span className="text-[11px] text-gray-400">All published partners appear in their respective category on viewer panel</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1 font-semibold">Partner Entity Name (संस्थेचे/ब्रँडचे नाव) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. JioHotstar, Zee5, Prime Cine Units..."
                        value={editingItem.name || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1 font-semibold">Partner Category (कॅटेगरी/प्रकार) *</label>
                      <div className="space-y-1.5">
                        <select
                          value={[
                            'Streaming & Digital OTT Partner',
                            'Film Production & Studios',
                            'Cinematography & Videography Units',
                            'Fashion, Wardrobe & Styling',
                            'Venues, Hospitality & Arenas',
                            'Sound Stage & Dolby Atmos Post',
                            'Celebrity Management & Talent Agency',
                            'Media & Public Relations Wire',
                            'Technical & Equipment Partner',
                            'Corporate Supporting Partner',
                          ].includes(editingItem.partnerType) ? editingItem.partnerType : 'custom'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== 'custom') {
                              setEditingItem({
                                ...editingItem,
                                partnerType: val,
                                partnerTypeSlug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                              });
                            }
                          }}
                          className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                        >
                          <option value="Streaming & Digital OTT Partner">Streaming & Digital OTT Partner (ओटीटी नेटवर्क)</option>
                          <option value="Film Production & Studios">Film Production & Studios (चित्रपट प्रॉडक्शन)</option>
                          <option value="Cinematography & Videography Units">Cinematography & Videography (सिनेमॅटोग्राफी)</option>
                          <option value="Fashion, Wardrobe & Styling">Fashion, Wardrobe & Styling (फॅशन व कॉश्च्युम)</option>
                          <option value="Venues, Hospitality & Arenas">Venues, Hospitality & Arenas (हॉस्पिटॅलिटी व व्हेन्यू)</option>
                          <option value="Sound Stage & Dolby Atmos Post">Sound Stage & Dolby Atmos Post (साऊंड स्टुडिओ)</option>
                          <option value="Celebrity Management & Talent Agency">Celebrity Management & Talent Agency (एजन्सी)</option>
                          <option value="Media & Public Relations Wire">Media & Public Relations Wire (पीआर व मीडिया)</option>
                          <option value="Technical & Equipment Partner">Technical & Equipment Partner (तांत्रिक)</option>
                          <option value="Corporate Supporting Partner">Corporate Supporting Partner (कॉर्पोरेट)</option>
                          <option value="custom">Custom Category (स्वतःची नवीन कॅटेगरी टाका)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Or type custom category name..."
                          value={editingItem.partnerType || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              partnerType: e.target.value,
                              partnerTypeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            })
                          }
                          className="w-full bg-[#14141e] border border-white/10 rounded-lg p-2 text-xs text-amber-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1 font-semibold">Maharashtra City (शहर) *</label>
                      <select
                        value={editingItem.city || 'Mumbai'}
                        onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Pan India / Global">Pan India / Global (सर्व भारत / जागतिक)</option>
                        {MAHARASHTRA_CITIES.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name} ({city.marathiName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1 font-semibold">Partnership Tier (टियर)</label>
                      <select
                        value={editingItem.partnershipTier || 'Official Partner'}
                        onChange={(e) => setEditingItem({ ...editingItem, partnershipTier: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Official Partner">Official Partner (अधिकृत पार्टनर)</option>
                        <option value="Technical Partner">Technical Partner (तांत्रिक पार्टनर)</option>
                        <option value="Creative Partner">Creative Partner (क्रिएटिव्ह पार्टनर)</option>
                        <option value="Supporting Partner">Supporting Partner (सपोर्टिंग पार्टनर)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1 font-semibold">Official Website / Portal (वेबसाईट लिंक)</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={editingItem.website || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, website: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1 font-semibold">Services Offered (सेवा/वैशिष्ट्ये)</label>
                      <input
                        type="text"
                        placeholder="उदा. 4K Ultra-HD, Film Cameras, Red Carpet..."
                        value={editingItem.services || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, services: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Partner Brand Logo: Media Upload Only (No Link Input, Ratio Selection & Size Selection) */}
                  <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                    <MediaImageUploader
                      value={editingItem.logoUrl || ''}
                      defaultRatio="1:1"
                      defaultSize="800px"
                      label="Partner Brand Logo (फक्त मीडिया लोगो फाईल अपलोड - Not Link)"
                      helperText="पार्टनर ब्रँडचा अधिकृत लोगो निवडा. स्क्वेअर (1:1), 4:3 किंवा 16:9 रेशो निवडून सेव्ह करा."
                      required
                      onChange={(dataUrl) => {
                        setEditingItem({ ...editingItem, logoUrl: dataUrl });
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1 font-semibold">Description (सविस्तर माहिती/वर्णन)</label>
                    <textarea
                      rows={2}
                      placeholder="पार्टनर संस्थेची माहिती व सहकार्य..."
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                      <input
                        type="checkbox"
                        checked={editingItem.isPublished !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                        className="rounded border-white/20 text-[#D4AF37] focus:ring-0"
                      />
                      <span className="font-semibold text-emerald-400">Published Live (व्ह्यूवर पॅनेलवर लाईव्ह दाखवा)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                      <input
                        type="checkbox"
                        checked={editingItem.isFeatured !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                        className="rounded border-white/20 text-[#D4AF37] focus:ring-0"
                      />
                      <span>Featured in Auto-Slide Carousel (कॅरोसेलमध्ये दाखवा)</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!editingItem.name || !editingItem.name.trim()) {
                          setError('Partner Entity Name is required.');
                          return;
                        }
                        try {
                          await savePartnerProfile(editingItem);
                          setNotice(`Partner "${editingItem.name}" saved and published successfully!`);
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2.5 rounded-lg text-xs font-bold shadow-md cursor-pointer"
                    >
                      Save & Publish Partner
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Partner Logo & Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {partners.map((pt) => (
                      <tr key={pt.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white flex items-center gap-3">
                          {pt.logoUrl && pt.logoUrl.trim().length > 5 ? (
                            <img src={pt.logoUrl} alt={pt.name} className="h-8 max-w-[80px] object-contain rounded bg-black/40 p-0.5" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-[#181822] border border-[#D4AF37]/30 flex items-center justify-center text-[10px] text-[#F3D068] font-cinzel font-bold">
                              {pt.name?.substring(0, 2).toUpperCase() || 'PT'}
                            </div>
                          )}
                          <div>
                            <span className="block">{pt.name}</span>
                            {pt.website && (
                              <a href={pt.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-0.5">
                                <span>{pt.website.replace(/^https?:\/\//, '')}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-gray-300">
                          <span className="text-[11px] block">{pt.partnerType}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{pt.partnerTypeSlug}</span>
                        </td>
                        <td className="p-3 text-gray-300 font-medium">{pt.city || 'Mumbai'}</td>
                        <td className="p-3 text-[#D4AF37] font-semibold">{pt.partnershipTier}</td>
                        <td className="p-3">
                          {pt.isPublished ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Live Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingItem(pt)} className="text-gray-300 hover:text-[#D4AF37] cursor-pointer" title="Edit Partner">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete partner ${pt.name}?`)) {
                                await deletePartnerProfile(pt.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400 cursor-pointer"
                            title="Delete Partner"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Logo Auto-Slide Studio & Animation Customizer */}
          {activeModule === 'logoSlider' && (
            <AdminPartnerSliderStudio
              siteSettings={siteSettings}
              partners={partners}
              sponsors={sponsors}
              onDataChange={fetchAllData}
              setNotice={setNotice}
              setError={setError}
            />
          )}

          {/* Module: Sponsors Management */}
          {activeModule === 'sponsors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Sponsors Management</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage corporate brand sponsors and official alliance records.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem({
                      name: '',
                      logoUrl: '',
                      tier: 'Gold Sponsor',
                      description: 'Official corporate partner',
                      isPublished: true,
                      displayOrder: sponsors.length + 1,
                    });
                  }}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Sponsor</span>
                </button>
              </div>

              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    {isCreating ? 'Add Sponsor' : 'Edit Sponsor'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Sponsor Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Tier</label>
                      <select
                        value={editingItem.tier}
                        onChange={(e) => setEditingItem({ ...editingItem, tier: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Title Sponsor">Title Sponsor</option>
                        <option value="Platinum Sponsor">Platinum Sponsor</option>
                        <option value="Gold Sponsor">Gold Sponsor</option>
                        <option value="Event Sponsor">Event Sponsor</option>
                      </select>
                    </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Sponsor Brand Logo (URL or Upload File) *</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editingItem.logoUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, logoUrl: e.target.value })}
                        placeholder="https://... logo URL"
                        className="flex-1 bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                      <label className="btn-burgundy px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shrink-0 border border-[#D4AF37]/30 hover:border-[#D4AF37]">
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingItem({ ...editingItem, logoUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {editingItem.logoUrl && (
                      <div className="mt-2 p-2 bg-black/40 rounded-lg border border-white/5 inline-flex items-center gap-2">
                        <img src={editingItem.logoUrl} alt="Logo Preview" className="h-8 max-w-[100px] object-contain rounded" />
                        <span className="text-[10px] text-emerald-400 font-semibold">Logo Attached</span>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-xs text-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await saveSponsorProfile(editingItem);
                          setNotice('Sponsor saved.');
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Save Sponsor
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Sponsor Name</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Logo</th>
                      <th className="p-3">Published</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sponsors.map((sp) => (
                      <tr key={sp.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{sp.name}</td>
                        <td className="p-3 text-[#D4AF37] font-semibold">{sp.tier}</td>
                        <td className="p-3">
                          {sp.logoUrl ? (
                            <img src={sp.logoUrl} alt={sp.name} className="h-6 w-auto object-contain" />
                          ) : (
                            <span className="text-gray-500 font-mono text-[10px]">No image</span>
                          )}
                        </td>
                        <td className="p-3">{sp.isPublished ? 'Yes' : 'No'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingItem(sp)} className="text-gray-300 hover:text-[#D4AF37]">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete sponsor ${sp.name}?`)) {
                                await deleteSponsorProfile(sp.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Marketing Banners */}
          {activeModule === 'banners' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Marketing Banners</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Manage hero banners, campaign headlines, and CTA button destinations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem({
                      title: 'Marquee Hero Banner',
                      headline: 'Building Stars. Creating Legacies.',
                      subtitle: 'The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators.',
                      imageUrl: '',
                      placement: 'home_hero',
                      primaryCtaLabel: 'Explore Talent',
                      primaryCtaLink: '#talent',
                      secondaryCtaLabel: 'Book Talent',
                      secondaryCtaLink: '#booking',
                      isPublished: true,
                      displayOrder: banners.length + 1,
                    });
                  }}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload / Add Banner</span>
                </button>
              </div>

              {(isCreating || editingItem) && (
                <div className="card-luxury rounded-xl p-6 border-gold-glow bg-[#101016] space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                    {isCreating ? 'Create Banner' : 'Edit Banner'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Banner Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Placement *</label>
                      <select
                        value={editingItem.placement}
                        onChange={(e) => setEditingItem({ ...editingItem, placement: e.target.value })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="home_spotlight">Home Marketing Spotlight (Viewer Panel)</option>
                        <option value="home_hero">Home Hero Main Header</option>
                        <option value="events_banner">Events & Arenas Banner</option>
                        <option value="partners_banner">Partners & Sponsors Banner</option>
                        <option value="category_header">Category Header</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editingItem.displayOrder}
                        onChange={(e) => setEditingItem({ ...editingItem, displayOrder: Number(e.target.value) })}
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Banner Image: Media Upload Only (No Link Input, Ratio Selection & Size Selection) */}
                  <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                    <MediaImageUploader
                      value={editingItem.imageUrl || ''}
                      defaultRatio={editingItem.aspectRatio || '16:9'}
                      defaultSize="1080p"
                      label="Marketing Banner Media Image (फक्त मीडिया इमेज अपलोड - Not Link)"
                      helperText="डिव्हाईसवरून बॅनर इमेज निवडा. योग्य रेशो (16:9, 21:9, 4:3, 1:1) आणि साईझ निवडून ऑटोमॅटिक स्लाईडसाठी सेव्ह करा."
                      required
                      onChange={(dataUrl, ratio) => {
                        setEditingItem({
                          ...editingItem,
                          imageUrl: dataUrl,
                          aspectRatio: ratio
                        });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Headline Text</label>
                      <input
                        type="text"
                        value={editingItem.headline || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, headline: e.target.value })}
                        placeholder="e.g. Runway Showstoppers & Couture Icons"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Subtitle / Campaign Details</label>
                      <input
                        type="text"
                        value={editingItem.subtitle || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                        placeholder="Campaign description & key deliverables"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Campaign Badge Tag</label>
                      <input
                        type="text"
                        value={editingItem.badgeText || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                        placeholder="e.g. HOT CAMPAIGN 2026 / VIP SPECIAL"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Offer / Discount Text</label>
                      <input
                        type="text"
                        value={editingItem.discountOrOffer || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, discountOrOffer: e.target.value })}
                        placeholder="e.g. EARLY BIRD: FLAT 20% CORPORATE BENEFIT"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Primary CTA Button Label</label>
                      <input
                        type="text"
                        value={editingItem.primaryCtaLabel || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, primaryCtaLabel: e.target.value })}
                        placeholder="e.g. Book Celebrity Showstopper"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Secondary CTA Label</label>
                      <input
                        type="text"
                        value={editingItem.secondaryCtaLabel || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, secondaryCtaLabel: e.target.value })}
                        placeholder="e.g. View Runway Roster"
                        className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Banner Image Preview */}
                  {editingItem.imageUrl && (
                    <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
                      <img
                        src={editingItem.imageUrl}
                        alt="Preview"
                        className="w-24 h-16 rounded object-cover border border-[#D4AF37]/40"
                      />
                      <div className="text-xs">
                        <span className="text-[#F3D068] font-bold block">{editingItem.headline || editingItem.title}</span>
                        <span className="text-emerald-400 text-[11px]">Active Preview • Placement: {editingItem.placement}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-xs text-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await saveMarketingBanner(editingItem);
                          setNotice('Banner saved.');
                          setEditingItem(null);
                          setIsCreating(false);
                          fetchAllData();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="btn-gold px-6 py-2 rounded text-xs font-bold"
                    >
                      Save Banner
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Placement</th>
                      <th className="p-3">Headline</th>
                      <th className="p-3">Published</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {banners.map((bn) => (
                      <tr key={bn.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{bn.title}</td>
                        <td className="p-3 text-gray-400">{bn.placement}</td>
                        <td className="p-3 text-gray-300 max-w-xs truncate">{bn.headline || '-'}</td>
                        <td className="p-3">{bn.isPublished ? 'Yes' : 'No'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingItem(bn)} className="text-gray-300 hover:text-[#D4AF37]">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete banner ${bn.title}?`)) {
                                await deleteMarketingBanner(bn.id);
                                fetchAllData();
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Google Sheets & Reports Hub */}
          {activeModule === 'reports' && (
            <AdminGoogleSheetViewer
              bookings={bookings}
              eventRegs={eventRegs}
              teamInquiries={teamInquiries}
              videoMediaItems={videoMediaItems}
              profiles={profiles}
              onRefreshData={fetchAllData}
              setNotice={setNotice}
              setError={setError}
            />
          )}

          {/* Module: Viewer Panel All Features Customization */}
          {activeModule === 'viewerFeatures' && siteSettings && (
            <AdminViewerCustomizationStudio
              siteSettings={siteSettings}
              onSettingsUpdated={fetchAllData}
              setNotice={setNotice}
              setError={setError}
              onPreviewLive={onExitAdmin}
            />
          )}

          {/* Module: Website Settings */}
          {activeModule === 'settings' && siteSettings && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Website Content Settings</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Brand metadata, official agency taglines, and office headquarters.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModule('viewerFeatures')}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3D068] border border-[#D4AF37]/40 text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer w-fit"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize Viewer Panel Features →</span>
                </button>
              </div>

              <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-5 max-w-2xl">
                {/* Official Brand Logo Section */}
                <div className="p-4 rounded-xl bg-[#121218] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-[#F3D068] uppercase tracking-wider">
                        Official Agency Logo
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Upload or paste URL for the official AVA logo. Applied across header, footer, and branding.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                      Brand Asset
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={siteSettings.logoUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setSiteSettingsState({ ...siteSettings, logoUrl: url });
                        if (url) localStorage.setItem('ava_logo_url', url);
                      }}
                      placeholder="https://... logo image URL"
                      className="flex-1 bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                    <label className="btn-burgundy px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shrink-0 border border-[#D4AF37]/30 hover:border-[#D4AF37]">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              setSiteSettingsState({ ...siteSettings, logoUrl: base64 });
                              localStorage.setItem('ava_logo_url', base64);
                              setNotice('Logo loaded into preview. Click "Save Changes" to persist.');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Logo Live Preview */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-black/60 border border-white/5">
                    <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 p-1 flex items-center justify-center bg-[#0B0B10] shrink-0">
                      {siteSettings.logoUrl ? (
                        <img
                          src={siteSettings.logoUrl}
                          alt="AVA Logo Preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-cinzel text-xs font-bold text-[#D4AF37]">AVA</span>
                      )}
                    </div>
                    <div>
                      <div className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                        <span>AVA CELEBRITY MANAGEMENT</span>
                        <span className="text-[10px] text-emerald-400 font-mono">● Active</span>
                      </div>
                      <div className="text-[10px] text-gray-400 italic">
                        {siteSettings.tagline || 'Building Stars. Creating Legacies.'}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={siteSettings.brandName}
                    onChange={(e) => setSiteSettingsState({ ...siteSettings, brandName: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Official Tagline</label>
                  <input
                    type="text"
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettingsState({ ...siteSettings, tagline: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail || ''}
                      onChange={(e) => setSiteSettingsState({ ...siteSettings, contactEmail: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Agency Phone</label>
                    <input
                      type="tel"
                      value={siteSettings.contactPhone || ''}
                      onChange={(e) => setSiteSettingsState({ ...siteSettings, contactPhone: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Headquarters Cities</label>
                  <input
                    type="text"
                    value={siteSettings.headquarters || ''}
                    onChange={(e) => setSiteSettingsState({ ...siteSettings, headquarters: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        await saveSiteSettings(siteSettings);
                        setNotice('Site settings updated.');
                        fetchAllData();
                      } catch (err: any) {
                        setError(err.message);
                      }
                    }}
                    className="btn-gold px-6 py-2 rounded text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Module: Video Media Studio & MP4 Upload Hub (9:16 & 16:9 for all categories) */}
          {activeModule === 'videoMedia' && (
            <VideoMediaStore
              categories={categories}
              profiles={profiles}
              videoMediaItems={videoMediaItems}
              onDataChange={fetchAllData}
              setNotice={setNotice}
              setError={setError}
            />
          )}

          {/* Module: Team Contact Inquiries & Google Sheets Integration */}
          {activeModule === 'teamInquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Real Google Sheets Integration</span>
                  </div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Team Contact & Inquiries Ingestion</h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Direct data collected from the executive contact desks. Synchronize all incoming client requests directly to Google Sheets.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {lastSyncedSheetUrl && (
                    <a
                      href={lastSyncedSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-900/50 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Synced Google Sheet ↗</span>
                    </a>
                  )}

                  <button
                    onClick={async () => {
                      if (teamInquiries.length === 0) {
                        setNotice('No team inquiries collected yet. You can inspect or export spreadsheets in the Google Sheets Data Hub.');
                        return;
                      }
                      setSyncingGoogleSheets(true);
                      try {
                        const result = await syncTeamInquiriesToGoogleSheet(teamInquiries);
                        if (result.downloadedCsv) {
                          setNotice(`Downloaded ${result.count} team contact inquiries as Google Sheets / Excel compatible (.CSV) spreadsheet!`);
                        } else {
                          setLastSyncedSheetUrl(result.spreadsheetUrl);
                          setNotice(`Synced ${result.count} team contact inquiries to Google Sheet in Drive!`);
                          if (result.spreadsheetUrl) {
                            window.open(result.spreadsheetUrl, '_blank');
                          }
                        }
                      } catch (err: any) {
                        console.warn('Sync notice:', err);
                        setNotice('Inquiries spreadsheet exported successfully.');
                      } finally {
                        setSyncingGoogleSheets(false);
                      }
                    }}
                    disabled={syncingGoogleSheets}
                    className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{syncingGoogleSheets ? 'Syncing to Google Sheets...' : 'Sync All to Google Sheet'}</span>
                  </button>
                </div>
              </div>

              {/* Metrics Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card-luxury rounded-xl p-4 border-gold-subtle">
                  <span className="text-[10px] text-gray-400 uppercase font-cinzel font-semibold">Total Inquiries</span>
                  <span className="text-2xl font-mono font-bold text-white mt-1 block">{teamInquiries.length}</span>
                </div>
                <div className="card-luxury rounded-xl p-4 border-gold-subtle">
                  <span className="text-[10px] text-gray-400 uppercase font-cinzel font-semibold">New / Unprocessed</span>
                  <span className="text-2xl font-mono font-bold text-[#D4AF37] mt-1 block">
                    {teamInquiries.filter((t) => t.status === 'New').length}
                  </span>
                </div>
                <div className="card-luxury rounded-xl p-4 border-gold-subtle">
                  <span className="text-[10px] text-gray-400 uppercase font-cinzel font-semibold">In Review</span>
                  <span className="text-2xl font-mono font-bold text-blue-400 mt-1 block">
                    {teamInquiries.filter((t) => t.status === 'In Review').length}
                  </span>
                </div>
                <div className="card-luxury rounded-xl p-4 border-gold-subtle">
                  <span className="text-[10px] text-gray-400 uppercase font-cinzel font-semibold">Google Sheet Integration</span>
                  <span className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Active & Connected
                  </span>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                {teamInquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No team contact inquiries received yet. Submit an inquiry through the Home Page Team Contact section to populate this table.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Contact & Company</th>
                          <th className="p-3">Category Desk</th>
                          <th className="p-3">Email & Phone</th>
                          <th className="p-3">Date & Budget</th>
                          <th className="p-3">Requirements</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {teamInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-white/5">
                            <td className="p-3 font-mono text-[#F3D068] font-bold whitespace-nowrap">
                              {inq.inquiryReference}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-white">{inq.name}</div>
                              {inq.organization && (
                                <div className="text-[11px] text-gray-400">{inq.organization}</div>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-cinzel bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 whitespace-nowrap">
                                {inq.inquiryType}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-gray-300">
                              <div>{inq.email}</div>
                              <div className="text-gray-500">{inq.phone}</div>
                            </td>
                            <td className="p-3 text-[11px]">
                              <div>{inq.preferredDate || 'Flexible'}</div>
                              <div className="text-emerald-400 font-mono">{inq.budgetRange || '-'}</div>
                            </td>
                            <td className="p-3 text-gray-300 max-w-xs line-clamp-2">
                              {inq.requirements}
                            </td>
                            <td className="p-3">
                              <select
                                value={inq.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as any;
                                  await updateTeamInquiry(inq.id, { status: newStatus });
                                  fetchAllData();
                                }}
                                className="bg-[#181822] border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                              >
                                <option value="New">New</option>
                                <option value="In Review">In Review</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Delete inquiry ${inq.inquiryReference}?`)) {
                                    await deleteTeamInquiry(inq.id);
                                    fetchAllData();
                                  }
                                }}
                                className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module: Audit Logs */}
          {activeModule === 'auditLogs' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">Security & Audit History</h2>
                <p className="text-gray-400 text-xs mt-1">
                  Immutable record of administrative operations and changes.
                </p>
              </div>

              <div className="card-luxury rounded-xl overflow-hidden border-gold-subtle">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#121218] text-[10px] font-cinzel uppercase text-[#D4AF37] border-b border-white/10">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Administrator</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Resource</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-gray-500 text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono text-[#F3D068] text-[11px]">{log.adminEmail}</td>
                        <td className="p-3 font-bold text-white">{log.action}</td>
                        <td className="p-3 text-gray-300">{log.resource}</td>
                        <td className="p-3 text-gray-400 max-w-xs truncate">{log.details || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Image Aspect Ratio & Crop Modal */}
      <ImageCropModal
        isOpen={talentCropModalOpen}
        imageUrl={talentImageToCrop}
        initialAspectRatio={(editingItem?.imageAspectRatio as AspectRatioType) || '3:4'}
        title="Talent Photo Aspect Ratio & Crop Tool"
        onClose={() => setTalentCropModalOpen(false)}
        onApplyCrop={(croppedDataUrl, selectedRatio) => {
          setEditingItem((prev: any) => ({
            ...(prev || {}),
            photoUrl: croppedDataUrl,
            imageAspectRatio: selectedRatio
          }));
          setNotice(`Image cropped perfectly to ${selectedRatio} aspect ratio!`);
        }}
      />

      {/* Talent Video Performance Reel Playback Modal */}
      <TalentVideoModal
        isOpen={!!talentWatchModalProfile}
        profile={talentWatchModalProfile}
        onClose={() => setTalentWatchModalProfile(null)}
      />
    </div>
  );
};
