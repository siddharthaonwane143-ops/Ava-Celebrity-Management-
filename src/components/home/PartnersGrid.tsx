import React, { useState, useEffect, useMemo } from 'react';
import { PartnerProfile, SponsorProfile, PartnerSliderSettings } from '../../types';
import {
  Handshake,
  Award,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Film,
  Camera,
  Crown,
  Building2,
  Tv,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Filter,
  Layers
} from 'lucide-react';
import { BrandEmblem } from '../common/BrandEmblem';

interface PartnersGridProps {
  partners: PartnerProfile[];
  sponsors: SponsorProfile[];
  onOpenBooking: (type?: string) => void;
  sliderSettings?: PartnerSliderSettings;
}

export interface AllianceItem {
  id: string;
  name: string;
  categoryType: string;
  categoryLabel: string;
  tier: string;
  description: string;
  website?: string;
  services?: string;
  logoUrl?: string;
  city: string;
  isSponsor: boolean;
}

export const PartnersGrid: React.FC<PartnersGridProps> = ({
  partners,
  sponsors,
  onOpenBooking,
  sliderSettings,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Dynamic Customization options from Admin
  const sectionTitle = sliderSettings?.sectionTitle || 'Official Partners & Event Sponsors';
  const badgeText = sliderSettings?.badgeText || 'Official Ecosystem & Alliances';
  const subtitle =
    sliderSettings?.subtitle ||
    'World-class OTT streaming networks, film production houses, cinematography units, luxury brand sponsors, and certified stage venues collaborating with AVA.';
  const speed = sliderSettings?.autoSlideSpeed || 'normal';
  const intervalTime = speed === 'fast' ? 2200 : speed === 'slow' ? 5000 : 3500;
  const marqueeDuration = speed === 'fast' ? '18s' : speed === 'slow' ? '46s' : '30s';
  const showReverse = sliderSettings?.enableReverseTrack ?? true;
  const showTabs = sliderSettings?.enableCategoryTabs ?? true;
  const showBanner = sliderSettings?.enableBannerSlide ?? true;
  const theme = sliderSettings?.designTheme || 'gold_luxury';

  // Zero demo data: Only genuine partners and sponsors published by the admin in Admin Panel
  const publishedPartners = useMemo(() => {
    return partners.filter((p) => p.isPublished !== false);
  }, [partners]);

  const publishedSponsors = useMemo(() => {
    return sponsors.filter((s) => s.isPublished !== false);
  }, [sponsors]);

  // Unified Alliance Items for display
  const allAllianceItems: AllianceItem[] = useMemo(() => {
    const list: AllianceItem[] = [];

    publishedPartners.forEach((p) => {
      list.push({
        id: p.id,
        name: p.name,
        categoryType: p.partnerTypeSlug || p.partnerType.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryLabel: p.partnerType || 'Official Partner',
        tier: p.partnershipTier || 'Official Partner',
        description: p.description || 'Official industry partner collaborating with AVA Celebrity Management.',
        website: p.website,
        services: p.services,
        logoUrl: p.logoUrl,
        city: p.city || 'Maharashtra',
        isSponsor: false,
      });
    });

    publishedSponsors.forEach((s) => {
      list.push({
        id: s.id,
        name: s.name,
        categoryType: 'sponsors',
        categoryLabel: 'Event & Brand Sponsor',
        tier: s.tier || 'Gold Sponsor',
        description: s.description || 'Official brand sponsor supporting national talent showcases.',
        website: s.website,
        services: s.benefits,
        logoUrl: s.logoUrl,
        city: 'Pan India / Global',
        isSponsor: true,
      });
    });

    return list;
  }, [publishedPartners, publishedSponsors]);

  // Dynamic Category Tabs computed directly from published items
  const dynamicCategories = useMemo(() => {
    const tabsMap = new Map<string, { id: string; label: string; count: number }>();
    tabsMap.set('all', { id: 'all', label: 'All Alliances (सर्व पार्टनर्स व स्पॉन्सर्स)', count: allAllianceItems.length });

    allAllianceItems.forEach((item) => {
      const tabId = item.isSponsor ? 'sponsors' : item.categoryType;
      const tabLabel = item.isSponsor ? 'Event Sponsors (स्पॉन्सर्स)' : item.categoryLabel;

      if (!tabsMap.has(tabId)) {
        tabsMap.set(tabId, { id: tabId, label: tabLabel, count: 1 });
      } else {
        tabsMap.get(tabId)!.count += 1;
      }
    });

    return Array.from(tabsMap.values());
  }, [allAllianceItems]);

  // Dynamic City options from active items
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    allAllianceItems.forEach((item) => {
      if (item.city) citySet.add(item.city.trim());
    });
    return ['All', ...Array.from(citySet).sort()];
  }, [allAllianceItems]);

  // Dynamic Category & City Filtering
  const filteredAlliances = useMemo(() => {
    return allAllianceItems.filter((item) => {
      // Category match
      let catMatch = false;
      if (activeCategory === 'all') {
        catMatch = true;
      } else if (activeCategory === 'sponsors') {
        catMatch = item.isSponsor;
      } else {
        catMatch =
          item.categoryType === activeCategory ||
          item.categoryLabel.toLowerCase() === activeCategory.toLowerCase();
      }

      // City match
      let cityMatch = false;
      if (selectedCity === 'All') {
        cityMatch = true;
      } else {
        cityMatch =
          item.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
          selectedCity.toLowerCase().includes(item.city.toLowerCase());
      }

      return catMatch && cityMatch;
    });
  }, [allAllianceItems, activeCategory, selectedCity]);

  // Auto-Slider Timer
  useEffect(() => {
    if (!isAutoPlay || isHovered || filteredAlliances.length <= 1) return;

    const stepTime = 50;
    let elapsed = 0;

    const ticker = setInterval(() => {
      elapsed += stepTime;
      setSlideProgress(Math.min(100, (elapsed / intervalTime) * 100));

      if (elapsed >= intervalTime) {
        elapsed = 0;
        setSlideProgress(0);
        setCurrentSlideIndex((prev) => (prev + 1) % filteredAlliances.length);
      }
    }, stepTime);

    return () => clearInterval(ticker);
  }, [isAutoPlay, isHovered, filteredAlliances.length, currentSlideIndex, intervalTime]);

  // Reset slide index on category or city change
  useEffect(() => {
    setCurrentSlideIndex(0);
    setSlideProgress(0);
  }, [activeCategory, selectedCity]);

  const handleNextSlide = () => {
    setSlideProgress(0);
    setCurrentSlideIndex((prev) => (prev + 1) % filteredAlliances.length);
  };

  const handlePrevSlide = () => {
    setSlideProgress(0);
    setCurrentSlideIndex((prev) => (prev - 1 + filteredAlliances.length) % filteredAlliances.length);
  };

  const activeItem = filteredAlliances[currentSlideIndex] || filteredAlliances[0] || allAllianceItems[0];

  // Marquee list duplicates for smooth infinite loop
  const marqueeItems = filteredAlliances.length > 0 ? filteredAlliances : allAllianceItems;
  const duplicatedMarquee = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const renderLogoImage = (item: AllianceItem, sizeClass = 'h-12 max-w-[150px]') => {
    const hasValidUrl = item.logoUrl && item.logoUrl.trim().length > 5;
    const isBroken = brokenImages[item.id];

    if (hasValidUrl && !isBroken) {
      return (
        <img
          src={item.logoUrl}
          alt={item.name}
          onError={() => handleImageError(item.id)}
          className={`${sizeClass} object-contain rounded filter drop-shadow transition-transform`}
        />
      );
    }

    return (
      <BrandEmblem name={item.name} tier={item.tier} className="w-full h-12" />
    );
  };

  return (
    <section id="partners-sponsors" className={`py-16 sm:py-24 border-t border-white/5 relative overflow-hidden ${
      theme === 'dark_velvet'
        ? 'bg-[#09050A]'
        : theme === 'cyber_minimal'
        ? 'bg-[#060608]'
        : 'bg-[#08080C]'
    }`}>
      {/* Background ambient lighting */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full blur-[140px] pointer-events-none ${
        theme === 'dark_velvet'
          ? 'bg-gradient-to-tr from-[#6B0E1E]/20 via-[#450812]/15 to-transparent'
          : theme === 'cyber_minimal'
          ? 'bg-gradient-to-tr from-sky-950/20 via-slate-900/15 to-transparent'
          : 'bg-gradient-to-tr from-[#9B111E]/10 via-[#D4AF37]/10 to-transparent'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181822] border border-[#D4AF37]/30 text-[#F3D068] text-xs font-cinzel font-bold uppercase tracking-widest mb-3 shadow">
            <Handshake className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{badgeText}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-extrabold tracking-tight">
            {sectionTitle}
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {allAllianceItems.length === 0 ? (
          /* Empty State: Invitation Card for New Brand Partners (As requested) */
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#16141F] via-[#100F17] to-[#1C160B] border-2 border-[#D4AF37]/40 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 border-2 border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#D4AF37]/20 text-[#D4AF37]">
              <Handshake className="w-10 h-10" />
            </div>
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-widest uppercase bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3D068] mb-3">
              Official Ecosystem & Brand Alliances
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Partner With <span className="text-gold-gradient">AVA Celebrity Management</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-light leading-relaxed">
              We collaborate with premier OTT streaming networks, film production studios, cinematography units, high-fashion brands, and luxury sponsors across Maharashtra.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-2xl mx-auto text-left text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>OTT Distribution</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Film Studios</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Fashion Galas</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Brand Sponsorships</span>
              </div>
            </div>
            <button
              onClick={() => onOpenBooking('Official Brand Partnership Application')}
              className="btn-gold px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold font-cinzel text-black uppercase tracking-wider inline-flex items-center gap-2 shadow-xl shadow-[#D4AF37]/25 hover:scale-105 transition cursor-pointer"
            >
              <span>Partner With Us / Brand Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Dynamic Category & City Filter Controls */}
        {showTabs && (
          <div className="space-y-3 mb-8">
            {/* Category Tabs */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {dynamicCategories.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition cursor-pointer flex items-center gap-2 border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-black font-bold shadow-lg shadow-[#D4AF37]/25 scale-105 border-[#D4AF37]'
                        : 'bg-[#121218] hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-black/30 text-black font-bold' : 'bg-white/10 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* City Filter Pills */}
            {availableCities.length > 2 && (
              <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <span className="text-[11px] text-gray-400 font-cinzel flex items-center gap-1 shrink-0 mr-1">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>City:</span>
                </span>
                {availableCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 border ${
                      selectedCity === city
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3D068] font-bold'
                        : 'bg-black/40 border-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {city === 'All' ? 'All Cities (सर्व शहरे)' : city}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 1. Interactive Auto-Slide Featured Banner Carousel */}
        {showBanner && activeItem && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="mb-10 rounded-2xl bg-gradient-to-br from-[#14141E] via-[#0E0E16] to-[#161208] border-2 border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-500"
          >
            {/* Countdown Progress Bar Line at Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3D068] transition-all duration-75"
                style={{ width: `${slideProgress}%` }}
              />
            </div>

            {/* Ambient Slide Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Brand Logo & Emblem Spotlight */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-xl bg-black/60 border border-white/10 text-center shadow-inner min-h-[160px]">
                {renderLogoImage(activeItem, 'max-h-24 sm:max-h-28 max-w-[220px]')}

                <span className="mt-3.5 inline-block px-3 py-1 rounded-full text-[10px] font-cinzel font-black uppercase tracking-wider bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3D068]">
                  {activeItem.tier}
                </span>
              </div>

              {/* Slide Content & Description */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel">
                      {activeItem.categoryLabel}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-300 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>{activeItem.city}</span>
                    </span>
                  </div>

                  {/* Play/Pause & Slide Navigation Controls */}
                  <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title={isAutoPlay ? 'Pause auto-slide' : 'Resume auto-slide'}
                    >
                      {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handlePrevSlide}
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Previous slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Next slide"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>{activeItem.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">
                    {activeItem.description}
                  </p>
                </div>

                {activeItem.services && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] font-cinzel">Capabilities:</span>
                    <span className="text-xs text-gray-300">{activeItem.services}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onOpenBooking(`Partner Collaboration: ${activeItem.name}`)}
                      className="btn-gold px-4 py-2 rounded-lg text-xs font-bold font-cinzel text-black flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>Collaborate With Partner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {activeItem.website && (
                      <a
                        href={activeItem.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs border border-white/10 transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                      </a>
                    )}
                  </div>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1.5">
                    {filteredAlliances.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSlideProgress(0);
                          setCurrentSlideIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentSlideIndex === idx ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-gray-600 hover:bg-gray-400'
                        }`}
                        title={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Continuous Auto-Sliding Logo Showcase (Marquee Strip) */}
        <div className="relative pt-2 mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-300 font-cinzel font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Partner & Sponsor Brand Logos (Auto-Slide Carousel / ऑटो स्लाईड)</span>
            </span>
            <span className="text-[11px] text-gray-400 hidden sm:inline font-mono">
              Hover to pause • Click logo to collaborate
            </span>
          </div>

          {/* Forward Auto-Sliding Marquee Track */}
          <div className="overflow-hidden relative w-full py-2 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div
              className="animate-marquee flex items-center gap-4"
              style={{ animationDuration: marqueeDuration }}
            >
              {duplicatedMarquee.map((item, idx) => (
                <div
                  key={`marquee-${item.id}-${idx}`}
                  onClick={() => onOpenBooking(`Partner: ${item.name}`)}
                  className="w-56 shrink-0 card-luxury rounded-xl p-3.5 border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-[#161622] transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-cinzel font-bold px-2 py-0.5 rounded bg-black/60 text-[#F3D068] border border-[#D4AF37]/30">
                      {item.tier}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-mono">
                      {item.isSponsor ? 'SPONSOR' : 'PARTNER'}
                    </span>
                  </div>

                  <div className="h-16 flex items-center justify-center my-1 group-hover:scale-105 transition-transform bg-black/40 rounded p-1">
                    {renderLogoImage(item, 'max-h-14 max-w-[140px]')}
                  </div>

                  <div className="mt-2 text-center">
                    <h4 className="font-cinzel text-xs font-bold text-white line-clamp-1 group-hover:text-[#F3D068] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider line-clamp-1 mt-0.5">
                      {item.categoryLabel}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-gray-400 flex items-center gap-0.5 truncate max-w-[120px]">
                      <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span className="truncate">{item.city}</span>
                    </span>
                    <span className="text-[#F3D068] font-bold group-hover:underline">
                      Enquire →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reverse Direction Auto-Sliding Marquee Track */}
          {showReverse && filteredAlliances.length > 3 && (
            <div className="overflow-hidden relative w-full pt-3 pb-2 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div
                className="animate-marquee-reverse flex items-center gap-4"
                style={{ animationDuration: marqueeDuration }}
              >
                {[...duplicatedMarquee].reverse().map((item, idx) => (
                  <div
                    key={`marquee-rev-${item.id}-${idx}`}
                    onClick={() => onOpenBooking(`Partner: ${item.name}`)}
                    className="w-56 shrink-0 card-luxury rounded-xl p-3.5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#161622] transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-cinzel font-bold px-2 py-0.5 rounded bg-black/60 text-[#F3D068] border border-[#D4AF37]/30">
                        {item.tier}
                      </span>
                      <span className="text-[9px] text-gray-400 uppercase font-mono">
                        {item.isSponsor ? 'SPONSOR' : 'PARTNER'}
                      </span>
                    </div>

                    <div className="h-16 flex items-center justify-center my-1 group-hover:scale-105 transition-transform bg-black/40 rounded p-1">
                      {renderLogoImage(item, 'max-h-14 max-w-[140px]')}
                    </div>

                    <div className="mt-2 text-center">
                      <h4 className="font-cinzel text-xs font-bold text-white line-clamp-1 group-hover:text-[#F3D068] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider line-clamp-1 mt-0.5">
                        {item.categoryLabel}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-gray-400 flex items-center gap-0.5 truncate max-w-[120px]">
                        <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                        <span className="truncate">{item.city}</span>
                      </span>
                      <span className="text-[#F3D068] font-bold group-hover:underline">
                        Enquire →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Published Official Partners & Sponsors Showcase Directory Grid */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D4AF37]" />
                <span>All Published Official Partners & Sponsors (अधिकृत पार्टनर कॅटलॉग)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Showing {filteredAlliances.length} published entities categorized with city location & capabilities.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Category:</span>
              <span className="text-xs text-[#F3D068] font-bold font-cinzel">
                {dynamicCategories.find((c) => c.id === activeCategory)?.label || 'All'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlliances.map((item) => (
              <div
                key={`grid-card-${item.id}`}
                className="card-luxury rounded-2xl p-5 border border-white/10 hover:border-[#D4AF37]/50 bg-[#101018] flex flex-col justify-between transition-all group shadow-md"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-cinzel font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30">
                      {item.tier}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>{item.city}</span>
                    </span>
                  </div>

                  {/* Logo Center */}
                  <div className="h-20 flex items-center justify-center p-3 rounded-xl bg-black/60 border border-white/5 my-2 group-hover:scale-105 transition-transform">
                    {renderLogoImage(item, 'max-h-16 max-w-[180px]')}
                  </div>

                  {/* Partner Name & Category */}
                  <div className="mt-3">
                    <h4 className="font-cinzel text-base font-bold text-white group-hover:text-[#F3D068] transition-colors flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </h4>
                    <p className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">
                      {item.categoryLabel}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Services / Benefits */}
                  {item.services && (
                    <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-300">
                      <span className="text-[10px] text-[#D4AF37] font-semibold block uppercase font-mono">Services:</span>
                      <span className="line-clamp-2">{item.services}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {item.website ? (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-500">Official Partner</span>
                  )}

                  <button
                    onClick={() => onOpenBooking(`Partner Inquiry: ${item.name}`)}
                    className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold text-black font-cinzel flex items-center gap-1 cursor-pointer shadow hover:scale-105 transition"
                  >
                    <span>Collaborate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAlliances.length === 0 && (
            <div className="text-center py-12 bg-black/30 rounded-2xl border border-white/5 p-8">
              <Handshake className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-cinzel">No partners found in this category or city.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSelectedCity('All'); }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3D068] text-xs font-bold hover:bg-[#D4AF37]/30 transition"
              >
                Reset Filters (सर्व पार्टनर्स बघा)
              </button>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </section>
  );
};
