import React, { useState, useMemo } from 'react';
import { TalentProfile, PartnerProfile, SponsorProfile } from '../../types';
import {
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  Flame,
  Award,
  Crown,
  Instagram,
  UserCheck,
  Handshake,
  ShieldCheck,
  FileText,
  Clock,
  ExternalLink,
  Building2,
  BadgeCheck,
  Download,
  Play,
  Film,
  Smartphone,
  Video
} from 'lucide-react';
import { MAHARASHTRA_CITIES } from '../../data/maharashtraCities';
import { BrandEmblem } from '../common/BrandEmblem';
import { TalentVideoModal } from '../modals/TalentVideoModal';

interface UnifiedVIPRosterSectionProps {
  profiles: TalentProfile[];
  partners: PartnerProfile[];
  sponsors: SponsorProfile[];
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  onViewProfile: (profile: TalentProfile) => void;
  onBookTalent: (talent: TalentProfile) => void;
  onOpenBooking: (type?: string, customNote?: string) => void;
  onExploreDirectory: (categorySlug?: string) => void;
  onOpenJoinTalent?: () => void;
}

export const UnifiedVIPRosterSection: React.FC<UnifiedVIPRosterSectionProps> = ({
  profiles,
  partners,
  sponsors,
  customTitle,
  customSubtitle,
  customBadge,
  onViewProfile,
  onBookTalent,
  onOpenBooking,
  onExploreDirectory,
  onOpenJoinTalent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeVideoTalent, setActiveVideoTalent] = useState<TalentProfile | null>(null);
  const [videoOnlyFilter, setVideoOnlyFilter] = useState(false);

  // Filter published profiles
  const publishedProfiles = useMemo(() => {
    return profiles.filter((p) => p.status === 'published');
  }, [profiles]);

  // Filter published partners
  const publishedPartners = useMemo(() => {
    return partners.filter((p) => p.isPublished);
  }, [partners]);

  // Filter published sponsors
  const publishedSponsors = useMemo(() => {
    return sponsors.filter((s) => s.isPublished);
  }, [sponsors]);

  // Categories configuration with Marathi & Hindi Industry tabs, Official Partners and Sponsors
  const categoryTabs = [
    { id: 'all', label: 'All VIP Roster', icon: Crown, count: publishedProfiles.length },
    {
      id: 'marathi-industry',
      label: '🚩 मराठी इंडस्ट्री (Marathi Natak & Cinema)',
      icon: Crown,
      count: publishedProfiles.filter((p) => p.industry === 'Marathi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Marathi') || p.city?.includes('Maharashtra') || p.city?.includes('Mumbai') || p.city?.includes('Pune')))).length,
    },
    {
      id: 'hindi-bollywood',
      label: '🎬 हिंदी बॉलिवूड (Hindi Bollywood & OTT)',
      icon: Film,
      count: publishedProfiles.filter((p) => p.industry === 'Hindi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Hindi') || p.categorySlug === 'actors'))).length,
    },
    {
      id: 'actors-actresses',
      label: 'Actors & Actresses',
      icon: Crown,
      count: publishedProfiles.filter((p) => p.categorySlug === 'actors-actresses' || p.categorySlug === 'celebrities').length,
    },
    {
      id: 'singers-musicians',
      label: 'Singers & Musicians',
      icon: Award,
      count: publishedProfiles.filter((p) => p.categorySlug === 'singers-musicians').length,
    },
    {
      id: 'models',
      label: 'Fashion Models',
      icon: Sparkles,
      count: publishedProfiles.filter((p) => p.categorySlug === 'models').length,
    },
    {
      id: 'anchors-hosts',
      label: 'Anchors & Hosts',
      icon: UserCheck,
      count: publishedProfiles.filter((p) => p.categorySlug === 'anchors-hosts').length,
    },
    {
      id: 'official-partners',
      label: 'Official Partners',
      icon: Handshake,
      count: publishedPartners.length,
    },
    {
      id: 'sponsors',
      label: 'Sponsors',
      icon: Award,
      count: publishedSponsors.length,
    },
  ];

  // Filtered talent profiles
  const filteredProfiles = useMemo(() => {
    if (selectedCategory === 'official-partners' || selectedCategory === 'sponsors') {
      return [];
    }

    return publishedProfiles.filter((p) => {
      // Category / Industry filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'marathi-industry') {
          const isMarathi = p.industry === 'Marathi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Marathi') || p.city?.includes('Maharashtra') || p.city?.includes('Mumbai') || p.city?.includes('Pune')));
          if (!isMarathi) return false;
        } else if (selectedCategory === 'hindi-bollywood') {
          const isHindi = p.industry === 'Hindi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Hindi') || p.categorySlug === 'actors'));
          if (!isHindi) return false;
        } else if (selectedCategory === 'actors-actresses') {
          if (p.categorySlug !== 'actors-actresses' && p.categorySlug !== 'celebrities') return false;
        } else if (p.categorySlug !== selectedCategory) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== 'All') {
        const matchesCity = (p.city || '').toLowerCase().includes(selectedCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSub = (p.subcategory || '').toLowerCase().includes(q);
        const matchesSkills = (p.skills || []).some((s) => s.toLowerCase().includes(q));
        const matchesCity = (p.city || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesSkills && !matchesCity) return false;
      }

      // Video media only filter
      if (videoOnlyFilter && !p.videoUrl) {
        return false;
      }

      return true;
    });
  }, [publishedProfiles, selectedCategory, selectedCity, searchQuery, videoOnlyFilter]);

  // Filtered partners
  const filteredPartners = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'official-partners') return [];
    return publishedPartners.filter((part) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = part.name.toLowerCase().includes(q);
        const matchesType = part.partnerType.toLowerCase().includes(q);
        const matchesServices = (part.services || '').toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesServices) return false;
      }
      return true;
    });
  }, [publishedPartners, selectedCategory, searchQuery]);

  // Filtered sponsors
  const filteredSponsors = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'sponsors') return [];
    return publishedSponsors.filter((spon) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = spon.name.toLowerCase().includes(q);
        const matchesTier = spon.tier.toLowerCase().includes(q);
        const matchesBenefits = (spon.benefits || '').toLowerCase().includes(q);
        if (!matchesName && !matchesTier && !matchesBenefits) return false;
      }
      return true;
    });
  }, [publishedSponsors, selectedCategory, searchQuery]);

  return (
    <section id="vip-roster" className="py-20 sm:py-24 bg-[#09090D] relative overflow-hidden border-t border-[#D4AF37]/20">
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#650B1B]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Professional 3-Step Booking Process on Homepage (User requested professional steps) */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14060B] via-[#0E0E16] to-[#171206] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#D4AF37] tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Agency Workflow</span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                Professional <span className="text-gold-gradient">3-Step VIP Booking Process</span>
              </h3>
            </div>
            <div className="text-xs text-gray-400 max-w-sm">
              Seamless VIP booking protocol with calendar date selection, Maharashtra venue rider, and instant digital PDF pass delivery.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#12121A]/80 border border-white/10 hover:border-[#D4AF37]/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/30">
                  STEP 01
                </span>
                <Crown className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1.5">
                Select VIP Category
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Choose from A-list Cinema Actors, Playback Vocalists, Runway Models, Anchors, Official Partners, or Sponsors with verified Instagram credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#12121A]/80 border border-white/10 hover:border-[#D4AF37]/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/30">
                  STEP 02
                </span>
                <Calendar className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1.5">
                Lock Calendar Date & City
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Enable interactive calendar date picker, specify reporting call time (IST), and select from 36 Maharashtra districts & premier venues.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#12121A]/80 border border-white/10 hover:border-[#D4AF37]/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/30">
                  STEP 03
                </span>
                <FileText className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1.5">
                Digital PDF Pass & SLA
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Instant automatic generation of official Digital Booking Pass PDF with unique reference code, dispatched directly to your registered email.
              </p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181822] border border-[#D4AF37]/40 text-[#F3D068] text-xs font-cinzel font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{customBadge || 'Exclusive Agency Ecosystem'}</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {customTitle ? customTitle : (
              <>Official <span className="text-gold-gradient">Celebrities, Partners & Sponsors</span></>
            )}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
            {customSubtitle || "Direct VIP bookings for India's leading cinematic actors, playback vocalists, international fashion supermodels, prime-time gala hosts, official media partners, and title sponsors."}
          </p>
        </div>

        {/* Category Tabs Switcher (Including Official Partners and Sponsors) & Create Profile CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8">
          <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth w-full md:w-auto">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-cinzel font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black border-[#F3D068] shadow-lg shadow-[#D4AF37]/20 scale-102'
                      : 'bg-[#121218] text-gray-300 border-white/10 hover:border-[#D4AF37]/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#D4AF37]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-black/30 text-black font-extrabold' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {onOpenJoinTalent && (
            <button
              onClick={onOpenJoinTalent}
              className="btn-gold px-4 py-2.5 rounded-xl text-xs sm:text-sm font-cinzel font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer shrink-0 w-full md:w-auto justify-center"
              title="Create official talent / artist profile"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>✨ Create Profile (नवीन प्रोफाईल बनवा)</span>
            </button>
          )}
        </div>

        {/* Search & Maharashtra City Filter Bar */}
        <div className="bg-[#12121A]/90 border border-white/10 rounded-2xl p-3 sm:p-4 mb-10 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md shadow-xl">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist, company name, musical style, or partner services..."
              className="w-full bg-[#0B0B10] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
            />
          </div>

          {selectedCategory !== 'official-partners' && selectedCategory !== 'sponsors' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0B0B10] border border-white/10 text-xs text-gray-300 shrink-0 w-full sm:w-auto">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer w-full"
                >
                  <option value="All" className="bg-[#101018] text-white">All Maharashtra & Global</option>
                  <option value="Mumbai" className="bg-[#101018] text-white">Mumbai MMR</option>
                  <option value="Pune" className="bg-[#101018] text-white">Pune</option>
                  <option value="Nagpur" className="bg-[#101018] text-white">Nagpur (Vidarbha)</option>
                  <option value="Nashik" className="bg-[#101018] text-white">Nashik</option>
                  <option value="Chhatrapati Sambhaji Nagar" className="bg-[#101018] text-white">Chhatrapati Sambhaji Nagar</option>
                  <option value="Kolhapur" className="bg-[#101018] text-white">Kolhapur</option>
                  <option value="Thane" className="bg-[#101018] text-white">Thane</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setVideoOnlyFilter(!videoOnlyFilter)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition border shrink-0 ${
                  videoOnlyFilter
                    ? 'bg-gradient-to-r from-pink-900/80 to-purple-900/80 border-pink-400 text-pink-200 shadow-md'
                    : 'bg-[#0B0B10] border-white/10 text-gray-400 hover:text-white'
                }`}
                title="Filter profiles with uploaded video reels"
              >
                <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>🎬 Videos ({publishedProfiles.filter((p) => p.videoUrl).length})</span>
              </button>
            </div>
          )}

          {(searchQuery || selectedCity !== 'All' || videoOnlyFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setVideoOnlyFilter(false);
              }}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 shrink-0 underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* 1. TALENT ROSTER DISPLAY */}
        {(selectedCategory === 'all' ||
          selectedCategory === 'actors-actresses' ||
          selectedCategory === 'singers-musicians' ||
          selectedCategory === 'models' ||
          selectedCategory === 'anchors-hosts') && (
          <>
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredProfiles.slice(0, 8).map((talent) => (
                  <div
                    key={talent.id}
                    className="group relative rounded-2xl overflow-hidden bg-[#101017] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/15"
                  >
                    {/* Photo or VIP Artist Crest (No demo stock images) */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#1C1014] via-[#120F16] to-[#0A0A0E] flex items-center justify-center">
                      {talent.photoUrl && talent.photoUrl.startsWith('data:image') ? (
                        <img
                          src={talent.photoUrl}
                          alt={talent.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative select-none">
                          <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />
                          <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37] bg-gradient-to-br from-[#260C14] to-[#120E08] flex flex-col items-center justify-center shadow-xl shadow-[#D4AF37]/25 group-hover:scale-105 transition-transform duration-500 relative">
                            <span className="text-2xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F3D068] via-white to-[#D4AF37]">
                              {talent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                            <span className="text-[8px] text-[#D4AF37] font-mono tracking-widest uppercase font-bold mt-0.5">
                              VIP ARTIST
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#F3D068] font-cinzel font-semibold">
                            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>AVA Official Roster</span>
                          </div>
                        </div>
                      )}

                      {/* Gradient vignettes */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101017] via-transparent to-black/60 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#F3D068] shadow">
                            {talent.categoryName || talent.categorySlug}
                          </span>

                          {talent.industry === 'Marathi' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-cinzel backdrop-blur shadow-sm border bg-orange-950/90 border-orange-500/70 text-orange-200">
                              🚩 मराठी
                            </span>
                          ) : talent.industry === 'Hindi' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-cinzel backdrop-blur shadow-sm border bg-purple-950/90 border-purple-500/70 text-purple-200">
                              🎬 हिंदी
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-cinzel backdrop-blur shadow-sm border bg-[#D4AF37]/25 border-[#D4AF37]/50 text-[#F3D068]">
                              🌟 मराठी+हिंदी
                            </span>
                          )}

                          {talent.talentType && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-cinzel backdrop-blur shadow-sm border ${
                                talent.talentType === 'Actress'
                                  ? 'bg-pink-950/80 border-pink-500/60 text-pink-300'
                                  : talent.talentType === 'Actor'
                                  ? 'bg-amber-950/80 border-amber-500/60 text-[#F3D068]'
                                  : talent.talentType === 'Influencer'
                                  ? 'bg-purple-950/80 border-purple-500/60 text-purple-300'
                                  : 'bg-white/15 border-white/20 text-white'
                              }`}
                            >
                              {talent.talentType === 'Actress' && '👑 '}
                              {talent.talentType === 'Actor' && '⭐ '}
                              {talent.talentType === 'Influencer' && '📱 '}
                              {talent.talentType}
                            </span>
                          )}
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black shrink-0">
                          {talent.availability || 'Available'}
                        </span>
                      </div>

                      {/* Video Reel Play Button Overlay */}
                      {talent.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/40 backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVideoTalent(talent);
                            }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3D068] to-[#D4AF37] text-black font-cinzel font-bold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-black" />
                            <span>Watch Reel ({talent.videoAspectRatio || '9:16'})</span>
                          </button>
                        </div>
                      )}

                      {/* Instagram Verified Pill */}
                      {talent.instagramHandle && (
                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 text-[11px]">
                          <div className="flex items-center gap-1.5 truncate">
                            <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                            <span className="text-white font-medium truncate">{talent.instagramHandle}</span>
                            {(talent.instagramVerified ?? true) && (
                              <span
                                className="w-3.5 h-3.5 rounded-full bg-[#0095F6] inline-flex items-center justify-center text-[8px] text-white font-bold shrink-0"
                                title="Official Verified Profile"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          {talent.instagramFollowers && (
                            <span className="text-[#D4AF37] font-mono text-[10px] font-bold shrink-0 pl-1">
                              {talent.instagramFollowers}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#F3D068] transition">
                            {talent.name}
                          </h3>
                          {talent.videoUrl && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-950/70 border border-pink-500/40 text-pink-300">
                              🎬 {talent.videoAspectRatio || '9:16'}
                            </span>
                          )}
                        </div>
                        <p className="text-[#D4AF37] text-xs font-semibold line-clamp-1 mt-0.5">
                          {talent.subcategory || talent.categoryName}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2">
                          <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span className="truncate">{talent.city || 'Mumbai / Pan-India'}</span>
                          {talent.experience && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="truncate">{talent.experience}</span>
                            </>
                          )}
                        </div>

                        {/* Regional Credits & Awards Chips */}
                        {(talent.marathiNatakOrTheatre || talent.marathiSerialsOrShows || talent.hindiFilmsOrBollywood || talent.hindiOttSeries || talent.notableAwards) && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {talent.marathiNatakOrTheatre && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-950/70 text-orange-200 border border-orange-500/40 truncate max-w-full" title={talent.marathiNatakOrTheatre}>
                                🎭 नाटक: {talent.marathiNatakOrTheatre}
                              </span>
                            )}
                            {talent.marathiSerialsOrShows && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-200 border border-amber-500/40 truncate max-w-full" title={talent.marathiSerialsOrShows}>
                                📺 मालिका: {talent.marathiSerialsOrShows}
                              </span>
                            )}
                            {talent.hindiFilmsOrBollywood && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/70 text-purple-200 border border-purple-500/40 truncate max-w-full" title={talent.hindiFilmsOrBollywood}>
                                🎬 फिल्म: {talent.hindiFilmsOrBollywood}
                              </span>
                            )}
                            {talent.hindiOttSeries && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/70 text-indigo-200 border border-indigo-500/40 truncate max-w-full" title={talent.hindiOttSeries}>
                                📱 OTT: {talent.hindiOttSeries}
                              </span>
                            )}
                            {talent.notableAwards && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/35 truncate max-w-full" title={talent.notableAwards}>
                                🏆 {talent.notableAwards}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-gray-400 text-xs line-clamp-2 mt-2 leading-relaxed">
                          {talent.bio}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => onBookTalent(talent)}
                          className="flex-1 btn-gold py-2 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <span>Direct Booking</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {talent.videoUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVideoTalent(talent);
                            }}
                            className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-pink-900/70 to-purple-900/70 hover:from-pink-800 hover:to-purple-800 text-pink-200 border border-pink-500/50 text-xs font-cinzel transition cursor-pointer shrink-0 flex items-center gap-1 shadow"
                            title="Watch Performance Reel / Showreel"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Reel</span>
                          </button>
                        )}

                        <button
                          onClick={() => onViewProfile(talent)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-cinzel transition cursor-pointer shrink-0"
                          title="View Artist Portfolio"
                        >
                          Portfolio
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-luxury rounded-2xl p-10 sm:p-14 text-center border border-[#D4AF37]/30 bg-[#0F0F16] mb-12 max-w-xl mx-auto shadow-2xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Real Artist Profiles & VIP Roster
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Only real certified profiles added by administration or verified artists registered on AVA are shown here. Zero demo records.
                </p>
                {onOpenJoinTalent && (
                  <button
                    onClick={onOpenJoinTalent}
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold inline-flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Create Your Profile (नवीन प्रोफाईल बनवा)</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* 2. OFFICIAL PARTNERS DISPLAY (when Official Partners tab selected or in All view) */}
        {(selectedCategory === 'all' || selectedCategory === 'official-partners') && filteredPartners.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Handshake className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Official <span className="text-gold-gradient">Production & Fashion Partners</span>
                </h3>
              </div>
              <span className="text-xs text-[#D4AF37] font-mono font-bold">
                {filteredPartners.length} Authorized Units
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="rounded-2xl p-5 bg-[#101018] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#181824] border border-white/10 shrink-0 flex items-center justify-center p-0.5">
                          {partner.logoUrl && partner.logoUrl.trim().length > 5 ? (
                            <img
                              src={partner.logoUrl}
                              alt={partner.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <BrandEmblem name={partner.name} tier={partner.partnershipTier} className="w-full h-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#F3D068] transition truncate">
                            {partner.name}
                          </h4>
                          <span className="text-[11px] text-[#D4AF37] font-semibold block truncate">
                            {partner.partnerType}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30 shrink-0">
                        {partner.partnershipTier || 'Official Partner'}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                      {partner.description}
                    </p>

                    {partner.services && (
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 mb-3">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">
                          Official Scope:
                        </span>
                        <span className="text-[11px] text-gray-300 line-clamp-1">
                          {partner.services}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => onOpenBooking(partner.partnerType, `Partnership booking inquiry with ${partner.name}`)}
                      className="flex-1 btn-gold py-2 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inquire Partnership</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition"
                        title="Partner Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SPONSORS DISPLAY (when Sponsors tab selected or in All view) */}
        {(selectedCategory === 'all' || selectedCategory === 'sponsors') && filteredSponsors.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Marquee <span className="text-gold-gradient">Event Sponsors & Title Alliances</span>
                </h3>
              </div>
              <span className="text-xs text-[#D4AF37] font-mono font-bold">
                {filteredSponsors.length} Marquee Brands
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="rounded-2xl p-5 bg-[#101018] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 font-bold uppercase">
                        {sponsor.tier}
                      </span>
                      {sponsor.website && (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-[#D4AF37] transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="w-full h-24 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                      {sponsor.logoUrl && sponsor.logoUrl.startsWith('data:image') ? (
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <BrandEmblem name={sponsor.name} tier={sponsor.tier} className="w-full h-24" />
                      )}
                    </div>

                    <h4 className="font-cinzel text-base font-bold text-white group-hover:text-[#F3D068] transition">
                      {sponsor.name}
                    </h4>

                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {sponsor.description}
                    </p>

                    {sponsor.benefits && (
                      <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-300 line-clamp-1">
                        <span className="text-gray-500 font-bold text-[10px]">Tier: </span>
                        {sponsor.benefits}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-4">
                    <button
                      onClick={() => onOpenBooking(`Sponsorship: ${sponsor.tier}`, `Corporate sponsorship alliance with ${sponsor.name}`)}
                      className="w-full btn-gold py-2 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Sponsor Alliance</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA: Full Directory Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onExploreDirectory(selectedCategory === 'all' ? undefined : selectedCategory)}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#14141E] hover:bg-[#1A1A28] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white text-xs sm:text-sm font-cinzel font-bold transition shadow-lg cursor-pointer"
          >
            <span>Explore Complete {selectedCategory !== 'all' ? categoryTabs.find(t => t.id === selectedCategory)?.label : 'VIP'} Directory</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

      </div>

      {/* Talent Video Modal */}
      <TalentVideoModal
        isOpen={!!activeVideoTalent}
        profile={activeVideoTalent}
        onClose={() => setActiveVideoTalent(null)}
        onBookTalent={onBookTalent}
      />
    </section>
  );
};
