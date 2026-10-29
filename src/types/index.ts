export type TalentStatus = 'draft' | 'pending' | 'approved' | 'published' | 'archived';
export type AvailabilityStatus = 'Available' | 'Limited' | 'Booked';

export interface TalentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  subcategories: string[]; // e.g. ["Lead Actor", "Method Actor", "Supporting"]
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TalentIndustry = 'Marathi' | 'Hindi' | 'Both';

export interface TalentProfile {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  subcategory?: string;
  bio: string;
  photoUrl: string;
  portfolioUrls?: string[];
  skills?: string[];
  languages?: string[];
  city?: string;
  experience?: string;
  supportedBookingTypes?: string[];
  availability: AvailabilityStatus;
  status: TalentStatus;
  isFeatured: boolean;
  isVerified?: boolean;
  creatorType?: string; // For influencers: Instagram, YouTube, UGC, Reels, etc.
  socialHandle?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  instagramVerified?: boolean;
  instagramFollowers?: string;
  logoUrl?: string;
  talentType?: 'Actor' | 'Actress' | 'Influencer' | 'Model' | 'Singer' | 'Dancer' | 'Anchor' | 'Creator';
  industry?: TalentIndustry;
  marathiNatakOrTheatre?: string; // Commercial/Sangeet/Experimental Natak (उदा. कट्यार, वाडा चिरेबंदी, सही रे सही)
  marathiSerialsOrShows?: string; // Zee Marathi, Star Pravah, Colors Marathi (उदा. सुखाच्या सरींनी, ठरलं तर मग)
  hindiFilmsOrBollywood?: string; // Bollywood Movies & Cinema (उदा. बॉलीवूड फिल्म्स, धर्मा, यशराज)
  hindiOttSeries?: string; // Netflix, Prime Video, Hotstar, SonyLIV (उदा. सेक्रेड गेम्स, फॅमिली मॅन)
  notableAwards?: string; // Filmfare, Zee Chitra Gaurav, Maharashtra State Awards, IIFA
  imageAspectRatio?: '3:4' | '1:1' | '4:5' | '16:9' | '9:16';
  videoUrl?: string; // Direct uploaded video file (MP4/WebM/data URL)
  videoAspectRatio?: '9:16' | '16:9';
  videoTitle?: string;
  videoDuration?: string;
  videoTag?: string; // 'Showreel' | 'Acting Monologue' | 'Viral Reel' | 'Audition Tape' | 'Fashion Walk' | 'Dance Clip'
  privateEmail?: string;
  privatePhone?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PricingType = 'fixed' | 'quote';

export interface Package {
  id: string;
  title: string;
  categorySlug: string;
  categoryName?: string;
  priceType: PricingType;
  price: string;
  duration?: string;
  deliverables: string[];
  exclusions?: string;
  imageUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  associatedTalentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Quote Prepared'
  | 'Awaiting Customer Response'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export interface Booking {
  id: string;
  bookingReference: string; // AVA-BK-XXXX
  customerUid?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingType: string;
  talentId?: string;
  talentName?: string;
  packageId?: string;
  packageTitle?: string;
  eventName: string;
  eventDate: string;
  eventTime?: string;
  cityVenue: string;
  maharashtraCity?: string;
  duration?: string;
  budgetRange?: string;
  serviceRequirements: string;
  additionalNotes?: string;
  status: BookingStatus;
  internalNotes?: string;
  quotationAmount?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventStatus =
  | 'Upcoming'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Completed'
  | 'Cancelled';

export interface TalentShow {
  id: string;
  title: string;
  category: string;
  bannerUrl: string;
  description: string;
  eventDate: string;
  registrationDeadline: string;
  format: 'Physical' | 'Online' | 'Hybrid';
  venue?: string;
  city?: string;
  eligibility: string;
  prizes?: string;
  feeType: 'Free' | 'Paid';
  feeAmount?: string;
  registrationLimit?: number;
  status: EventStatus;
  isPublished: boolean;
  registeredCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type RegistrationStatus = 'Pending' | 'Approved' | 'Waitlisted' | 'Rejected' | 'Withdrawn';

export interface EventRegistration {
  id: string;
  registrationReference: string; // AVA-EV-XXXX
  eventId: string;
  eventTitle: string;
  participantUid?: string;
  fullName: string;
  email: string;
  phone: string;
  age?: string;
  city?: string;
  category: string;
  performanceDetails: string;
  portfolioLink?: string;
  status: RegistrationStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuditionStatus = 'Open' | 'Closing Soon' | 'Closed';

export interface Audition {
  id: string;
  projectTitle: string;
  category: string;
  description: string;
  eligibility: string;
  auditionMethod: 'In-Person' | 'Self-Tape / Online' | 'Hybrid';
  deadline: string;
  location?: string;
  requiredMaterials: string;
  terms?: string;
  status: AuditionStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuditionApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Selected'
  | 'Rejected';

export interface AuditionApplication {
  id: string;
  applicationReference: string; // AVA-AUD-XXXX
  auditionId: string;
  projectTitle: string;
  applicantUid?: string;
  fullName: string;
  email: string;
  phone: string;
  experience?: string;
  reelUrl?: string;
  headshotUrl?: string;
  notes?: string;
  status: AuditionApplicationStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TalentApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Approved'
  | 'Rejected';

export interface TalentApplication {
  id: string;
  applicationReference: string; // AVA-TAL-XXXX
  applicantUid?: string;
  fullName: string;
  stageName?: string;
  category: string;
  email: string;
  phone: string;
  city?: string;
  bio: string;
  portfolioUrl?: string;
  headshotUrl?: string;
  status: TalentApplicationStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PartnerTier =
  | 'Official Partner'
  | 'Technical Partner'
  | 'Creative Partner'
  | 'Production Partner'
  | 'Supporting Partner';

export interface PartnerProfile {
  id: string;
  name: string;
  partnerType: string;
  partnerTypeSlug: string;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  website?: string;
  services?: string;
  city?: string;
  partnershipTier: PartnerTier;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type SponsorTier =
  | 'Title Sponsor'
  | 'Platinum Sponsor'
  | 'Gold Sponsor'
  | 'Event Sponsor';

export interface SponsorProfile {
  id: string;
  name: string;
  logoUrl: string;
  tier: SponsorTier;
  description: string;
  website?: string;
  benefits?: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type BannerPlacement =
  | 'home_hero'
  | 'home_spotlight'
  | 'category_header'
  | 'events_banner'
  | 'partners_banner';

export interface MarketingBanner {
  id: string;
  title: string;
  headline?: string;
  subtitle?: string;
  imageUrl: string;
  placement: BannerPlacement;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  badgeText?: string;
  discountOrOffer?: string;
  aspectRatio?: '16:9' | '21:9' | '4:3' | '1:1';
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerSliderSettings {
  sectionTitle: string;
  badgeText: string;
  subtitle: string;
  autoSlideSpeed: 'fast' | 'normal' | 'slow';
  slideDirection: 'ltr' | 'rtl' | 'dual';
  animationStyle: 'continuous_marquee' | 'smooth_carousel' | 'pulse_glow';
  designTheme: 'gold_luxury' | 'dark_velvet' | 'cyber_minimal';
  enableReverseTrack: boolean;
  enableCategoryTabs: boolean;
  enableHoverPause: boolean;
  enableBannerSlide: boolean;
  cardSize: 'compact' | 'standard' | 'large';
}

export interface ViewerFeatureCustomization {
  // Top Notice & Marquee Ticker
  enableNoticeTicker?: boolean;
  noticeTickerText?: string;
  noticeTickerBadge?: string;
  noticeTickerTheme?: 'gold' | 'crimson' | 'violet' | 'emerald';
  noticeTickerLink?: string;

  // Homepage Sections Toggles
  showHeroBanner?: boolean;
  showCommandHubThreeLines?: boolean;
  showMarketingBanners?: boolean;
  showEventFestivalVideos?: boolean;
  showVIPRoster?: boolean;
  showUpcomingShows?: boolean;
  showPartnersGrid?: boolean;
  showAIToolsSuite?: boolean;
  showTestimonials?: boolean;
  showTeamContact?: boolean;

  // Header & Navigation Features
  showSearchBar?: boolean;
  showAISearchButton?: boolean;
  showVoiceGuideButton?: boolean;
  showFloatingWhatsApp?: boolean;
  whatsAppNumber?: string;
  whatsAppDefaultMessage?: string;
  showMobileBottomNav?: boolean;

  // Viewer Profile & Verification Features
  allowViewerProfileEdit?: boolean;
  requirePhoneVerification?: boolean;
  allowViewerIdUpload?: boolean;
  showVerifiedViewerBadge?: boolean;
  viewerWelcomeNote?: string;

  // Booking & Inquiry Features
  allowInstantBooking?: boolean;
  allowPdfPassDownload?: boolean;
  showDirectCallButton?: boolean;
  currencyDisplay?: 'INR' | 'USD' | 'AED';

  // Hero Section Customization
  heroBadgeText?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroPrimaryBtnText?: string;
  heroSecondaryBtnText?: string;
  heroShowsBtnText?: string;

  // Talent Showcase Customization (Admin Decides Display & Text)
  talentShowcaseTitle?: string;
  talentShowcaseSubtitle?: string;
  talentShowcaseBadge?: string;
}

export interface SiteSettings {
  id: string;
  brandName: string;
  tagline: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  headquarters?: string;
  enabledNavItems: string[];
  heroHeadline: string;
  heroSubtitle: string;
  partnerSliderSettings?: PartnerSliderSettings;
  viewerFeatures?: ViewerFeatureCustomization;
  themeSettings?: ThemeCustomizationSettings;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  resource: string;
  details?: string;
  createdAt: string;
}

export type LiveTelecastStatus = 'LIVE NOW' | 'UPCOMING' | 'REPLAY' | 'OFFLINE';
export type VideoSourceType = 'direct_mp4' | 'uploaded_file' | 'camera_stream' | 'hls_stream' | 'custom_url' | 'youtube';

export interface LiveTelecast {
  id: string;
  showTitle: string;
  editionSubtitle?: string;
  category?: string;
  status: LiveTelecastStatus;
  videoUrl: string; // Direct MP4/WebM video, uploaded file blob/data, camera stream, HLS stream or custom embed
  sourceType?: VideoSourceType;
  streamQuality?: string; // e.g. '1080p60 Full HD' | '4K UHD Direct'
  cameraAngle?: string; // e.g. 'Main Stage Direct' | 'Runway VIP' | 'Red Carpet'
  embedType?: 'direct_video' | 'youtube' | 'custom' | 'iframe';
  thumbnailUrl?: string;
  scheduledTime?: string;
  presenter?: string;
  featuredTalent?: string;
  viewerCount?: number;
  description?: string;
  announcement?: string;
  allowLiveChat?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TeamContactInquiryType =
  | 'Executive Talent Booking'
  | 'Fashion Runway & Show Direction'
  | 'Celebrity Stage & Live Concert'
  | 'Brand Collab & Influencer Campaign'
  | 'Production & Film Crew Management'
  | 'VIP Sponsorship & Media Partner'
  | 'General Agency Inquiry';

export interface TeamContactInquiry {
  id: string;
  inquiryReference: string; // AVA-TC-XXXX
  name: string;
  organization?: string;
  email: string;
  phone: string;
  inquiryType: TeamContactInquiryType;
  preferredDate?: string;
  budgetRange?: string;
  cityVenue?: string;
  requirements: string;
  status: 'New' | 'In Review' | 'Contacted' | 'Closed';
  syncedToGoogleSheet?: boolean;
  googleSpreadsheetUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TestimonialAuthorType = 'artist' | 'client';

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  organization?: string;
  authorType: TestimonialAuthorType;
  quote: string;
  category: string;
  city: string;
  avatarUrl?: string;
  rating?: number; // Optional: Only populated for genuine live ratings
  isRealRating?: boolean; // True ONLY if submitted from live verified customer or event
  isLiveRating?: boolean; // True ONLY for active live rated content
  projectOutcome?: string;
  verifiedBadge?: string;
  date?: string;
  isFeatured?: boolean;
}

// ----------------------------------------------------
// Professional Video Media & MP4 Upload Library
// ----------------------------------------------------
export type VideoAspectRatio = '9:16' | '16:9';
export type VideoType = 'event' | 'festival' | 'long_video' | 'showreel' | 'performance' | 'monologue' | 'dance' | 'fashion' | 'reel' | 'bts' | 'commercial';

export type ProfessionalVideoCategorySlug =
  | 'all'
  | 'showreels'
  | 'monologues'
  | 'dance'
  | 'fashion'
  | 'reels'
  | 'highlights'
  | 'bts'
  | 'commercials';

export interface VideoCategoryMeta {
  id: string;
  slug: ProfessionalVideoCategorySlug;
  name: string;
  marathiName: string;
  tag: string;
  badge: string;
  description: string;
}

export const PROFESSIONAL_VIDEO_CATEGORIES: VideoCategoryMeta[] = [
  {
    id: 'cat-all',
    slug: 'all',
    name: 'All Videos (सर्व व्हिडिओ)',
    marathiName: 'सर्व व्हिडिओ',
    tag: 'All',
    badge: 'ALL MEDIA',
    description: 'Comprehensive media library across all talent and event recordings'
  },
  {
    id: 'cat-showreels',
    slug: 'showreels',
    name: 'Acting Showreels (अभिनय शोरील्स)',
    marathiName: 'अभिनय शोरील्स',
    tag: 'Acting Showreel',
    badge: 'CINEMA & OTT',
    description: 'Curated actor showreels, dramatic scenes, and industry reels'
  },
  {
    id: 'cat-monologues',
    slug: 'monologues',
    name: 'Audition Monologues (ऑडिशन मोनोलॉग्स)',
    marathiName: 'ऑडिशन मोनोलॉग्स',
    tag: 'Audition Monologue',
    badge: 'AUDITIONS',
    description: 'High-impact Marathi, Hindi & English audition self-tapes and scripts'
  },
  {
    id: 'cat-dance',
    slug: 'dance',
    name: 'Dance & Choreography (नृत्य व कोरियोग्राफी)',
    marathiName: 'नृत्य व कोरियोग्राफी',
    tag: 'Dance Performance',
    badge: 'STAGE & CHOREO',
    description: 'Classical, Bollywood, Lavani, and contemporary stage performances'
  },
  {
    id: 'cat-fashion',
    slug: 'fashion',
    name: 'Fashion Runway & Editorial (फॅशन व रॅम्प वॉक)',
    marathiName: 'फॅशन व रॅम्प वॉक',
    tag: 'Fashion Runway',
    badge: 'HAUTE COUTURE',
    description: 'Runway walk, couture shoots, and model portfolio video reels'
  },
  {
    id: 'cat-reels',
    slug: 'reels',
    name: 'Viral Reels 9:16 (व्हायरल व्हर्टिकल रील्स)',
    marathiName: 'व्हर्टिकल रील्स',
    tag: 'Viral Reel',
    badge: '9:16 VERTICAL',
    description: 'Full-screen mobile vertical reels optimized for social velocity'
  },
  {
    id: 'cat-highlights',
    slug: 'highlights',
    name: 'Event Highlights (इव्हेंट हायलाइट्स)',
    marathiName: 'इव्हेंट हायलाइट्स',
    tag: 'Event Highlights',
    badge: 'VIP GALAS',
    description: 'Celebrity galas, red carpet arrivals, concerts, and festival celebrations'
  },
  {
    id: 'cat-bts',
    slug: 'bts',
    name: 'Behind The Scenes (पडद्यामागील दृश्ये BTS)',
    marathiName: 'पडद्यामागे',
    tag: 'Behind The Scenes',
    badge: 'EXCLUSIVE BTS',
    description: 'Unseen rehearsal moments, greenroom prep, and photoshoot outtakes'
  },
  {
    id: 'cat-commercials',
    slug: 'commercials',
    name: 'Brand Commercials & Ads (ब्रँड जाहिराती)',
    marathiName: 'ब्रँड जाहिराती',
    tag: 'Brand Commercial',
    badge: 'AD CAMPAIGNS',
    description: 'Television commercials, product promos, and brand endorsement films'
  }
];

export interface VideoMediaItem {
  id: string;
  title: string;
  aspectRatio: VideoAspectRatio; // 9:16 vertical or 16:9 landscape
  categorySlug: string;
  categoryName: string;
  videoUrl: string; // Direct MP4 / WebM / blob / data URL
  fileName?: string;
  fileSizeBytes?: number;
  durationFormatted?: string; // e.g. "01:30" or "45:00" for long videos
  resolution?: string; // e.g. "1080x1920 (9:16 Vertical)" or "1920x1080 (16:9 Landscape)"
  description?: string;
  artistName?: string;
  videoTag?: string; // 'Acting Showreel' | 'Audition Monologue' | 'Dance Performance' | 'Fashion Runway' | 'Viral Reel' | 'Event Highlights' | 'Behind The Scenes' | 'Brand Commercial'
  videoType?: VideoType;
  festivalName?: string;
  eventVenue?: string;
  eventDate?: string;
  isLongVideo?: boolean;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// Theme Decoration & Design Customization Suite
// ----------------------------------------------------
export type ThemePreset = 'royal_gold' | 'midnight_platinum' | 'velvet_maroon' | 'dark_noir';
export type GoldGlowIntensity = 'subtle' | 'vibrant' | 'neon';
export type CardBevelStyle = 'diamond_gold' | 'subtle_hairline' | 'double_border_royal' | 'glass_bevel';
export type AmbientLighting = 'spotlight' | 'golden_aurora' | 'deep_starlight' | 'pure_minimalist';
export type BannerDecoration = 'filigree' | 'modern_sleek' | 'ornate_corners';
export type FontStyle = 'cinzel_regal' | 'playfair_classic' | 'montserrat_modern';

export interface ThemeCustomizationSettings {
  preset: ThemePreset;
  goldGlowIntensity: GoldGlowIntensity;
  cardBevelStyle: CardBevelStyle;
  ambientLighting: AmbientLighting;
  bannerDecoration: BannerDecoration;
  fontStyle: FontStyle;
  customGoldColor?: string;
  customBackgroundColor?: string;
  cardOpacity?: number;
  enableHeaderGlow?: boolean;
  enableAnimatedBorders?: boolean;
}

export const DEFAULT_THEME_SETTINGS: ThemeCustomizationSettings = {
  preset: 'royal_gold',
  goldGlowIntensity: 'vibrant',
  cardBevelStyle: 'diamond_gold',
  ambientLighting: 'spotlight',
  bannerDecoration: 'filigree',
  fontStyle: 'cinzel_regal',
  customGoldColor: '#D4AF37',
  customBackgroundColor: '#07070A',
  cardOpacity: 0.95,
  enableHeaderGlow: true,
  enableAnimatedBorders: true,
};

// ----------------------------------------------------
// Viewer & Client Self Profile Model with Real Verification
// ----------------------------------------------------
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  isPhoneVerified?: boolean;
  phoneVerifiedAt?: string;
  city?: string;
  district?: string;
  state?: string;
  userType?: 'Viewer' | 'Client' | 'Artist' | 'Model' | 'Organizer';
  primaryCategory?: string;
  bio?: string;
  photoUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  isInstagramVerified?: boolean;
  instagramFollowers?: string;
  govtIdType?: 'Aadhaar' | 'PAN' | 'Passport' | 'Voter ID' | 'Driving License';
  govtIdNumber?: string;
  isGovtIdVerified?: boolean;
  verificationStatus?: 'Unverified' | 'Phone_Verified' | 'ID_Submitted' | 'Fully_Verified';
  agencyVerifiedBadge?: boolean;
  createdAt: string;
  updatedAt: string;
}


