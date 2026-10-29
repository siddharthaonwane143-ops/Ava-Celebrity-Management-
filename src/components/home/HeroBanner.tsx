import React, { useState, useEffect } from 'react';
import { MarketingBanner, SiteSettings } from '../../types';
import { Sparkles, ArrowRight, Star, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  banners: MarketingBanner[];
  siteSettings: SiteSettings | null;
  onExploreTalent: () => void;
  onBookTalent: () => void;
  onUpcomingShows?: () => void;
  onJoinTalent?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  siteSettings,
  onExploreTalent,
  onBookTalent,
  onUpcomingShows,
  onJoinTalent,
}) => {
  const heroBanners = banners.filter(b => b.placement === 'home_hero' && b.isPublished);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const activeBanner = heroBanners[currentIndex];

  const headline = activeBanner?.headline || siteSettings?.viewerFeatures?.heroHeadline || siteSettings?.heroHeadline || 'Building Stars. Creating Legacies.';
  const subtitle = activeBanner?.subtitle || siteSettings?.viewerFeatures?.heroSubtitle || siteSettings?.heroSubtitle || 'The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators.';
  const hasCustomBg = activeBanner?.imageUrl && activeBanner.imageUrl.startsWith('data:image');
  const badgeText = siteSettings?.viewerFeatures?.heroBadgeText || 'AVA CELEBRITY MANAGEMENT';
  const primaryBtn1Text = activeBanner?.primaryCtaLabel || siteSettings?.viewerFeatures?.heroPrimaryBtnText || 'EXPLORE TALENT';
  const primaryBtn2Text = siteSettings?.viewerFeatures?.heroSecondaryBtnText || 'BOOK TALENT';
  const showsBtnText = siteSettings?.viewerFeatures?.heroShowsBtnText || 'Upcoming Talent Shows';

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#070709]">
      {/* Background Media with Cinematic Luxury Lighting (No demo stock images) */}
      <div className="absolute inset-0 z-0">
        {hasCustomBg && (
          <img
            src={activeBanner.imageUrl}
            alt={activeBanner?.title || 'AVA Celebrity Management'}
            className="w-full h-full object-cover object-center filter brightness-[0.35] transition-all duration-1000 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-radial-gradient from-[#4A0512]/40 via-[#12080E]/80 to-[#070709]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#D4AF37]/20 blur-3xl pointer-events-none animate-pulse-gold" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#650B1B]/35 blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#D4AF37]/8 blur-[160px] pointer-events-none" />
      </div>

      {/* Luxury Gradient Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#08080A] via-transparent to-[#08080A]" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        {/* Monogram Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181820]/90 border border-[#D4AF37]/50 backdrop-blur-md mb-5 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          <span className="font-cinzel text-[10px] sm:text-[11px] uppercase tracking-widest text-gold-shimmer font-bold">
            {badgeText}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
          <span className="text-gray-400 text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold">
            GLOBAL ROSTER
          </span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-5 sm:mb-6">
          <span className="text-gold-gradient block">
            {headline}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10 text-balance">
          {subtitle}
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Primary 1: Explore Talent */}
          <button
            onClick={onExploreTalent}
            className="btn-gold touch-press w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 group min-h-[48px]"
          >
            <span>{primaryBtn1Text}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Primary 2: Book Talent */}
          <button
            onClick={onBookTalent}
            className="btn-burgundy touch-press w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>{primaryBtn2Text}</span>
          </button>
        </div>

        {/* Secondary Navigation Quick CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-gray-400 border-t border-white/10 pt-6 w-full max-w-lg">
          <button
            onClick={() => {
              document.getElementById('partners-sponsors')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#F3D068] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Partners & Alliances</span>
          </button>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <button
            onClick={() => {
              document.getElementById('events-festivals-videos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#F3D068] transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Event & Festival Videos</span>
          </button>
        </div>

        {/* Banner indicator dots if multiple */}
        {heroBanners.length > 1 && (
          <div className="flex items-center gap-2 mt-8">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-6 bg-[#D4AF37]'
                    : 'w-1.5 bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
