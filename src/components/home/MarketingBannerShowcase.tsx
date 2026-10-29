import React, { useState, useEffect } from 'react';
import { MarketingBanner } from '../../types';
import {
  Sparkles,
  ArrowRight,
  Crown,
  Tag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Flame,
  Star
} from 'lucide-react';

interface MarketingBannerShowcaseProps {
  banners: MarketingBanner[];
  onOpenBooking: (type?: string, customNote?: string) => void;
  onExploreCategory?: (slug?: string) => void;
}

export const MarketingBannerShowcase: React.FC<MarketingBannerShowcaseProps> = ({
  banners,
  onOpenBooking,
  onExploreCategory
}) => {
  // Show all published marketing banners
  const publishedBanners = banners.filter((b) => b.isPublished !== false);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const intervalTime = 4000; // 4 seconds auto-slide per user request

  // Auto-slide effect every 4 seconds with pause on hover
  useEffect(() => {
    if (!isAutoPlay || isHovered || publishedBanners.length <= 1) return;

    const stepMs = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += stepMs;
      setProgress(Math.min(100, (elapsed / intervalTime) * 100));

      if (elapsed >= intervalTime) {
        elapsed = 0;
        setProgress(0);
        setActiveIdx((prev) => (prev + 1) % publishedBanners.length);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, publishedBanners.length, activeIdx, intervalTime]);

  // Reset progress bar on index change
  useEffect(() => {
    setProgress(0);
  }, [activeIdx]);

  if (publishedBanners.length === 0) return null;

  const current = publishedBanners[activeIdx] || publishedBanners[0];

  const handleNext = () => {
    setProgress(0);
    setActiveIdx((prev) => (prev + 1) % publishedBanners.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setActiveIdx((prev) => (prev - 1 + publishedBanners.length) % publishedBanners.length);
  };

  const hasCustomMedia =
    current.imageUrl &&
    current.imageUrl.trim().length > 5 &&
    !imgErrors[current.id || `${activeIdx}`];

  return (
    <section className="py-14 sm:py-20 bg-[#07070B] border-t border-b border-[#D4AF37]/25 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-red-600/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Campaigns & Strategic Alliances</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Exclusive <span className="text-gold-gradient">Marketing Banners & Special Seasons</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Curated partnership seasons, couture runway campaigns, and headliner concert bookings with executive agency riders.
            </p>
          </div>

          {/* Carousel Controls if multiple banners */}
          {publishedBanners.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                title={isAutoPlay ? 'Pause auto-slide' : 'Resume auto-slide'}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                title="Previous Campaign"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-[#D4AF37] px-2 font-bold">
                {activeIdx + 1} / {publishedBanners.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                title="Next Campaign"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Big Showcase Card with Pause on Hover */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="card-luxury rounded-3xl overflow-hidden border-[#D4AF37]/35 shadow-2xl bg-gradient-to-br from-[#121118] via-[#0C0B12] to-[#15100B] relative group transition-all duration-500"
        >
          {/* Top Countdown Progress Bar Line */}
          {publishedBanners.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3D068] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                {/* Campaign Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3D068] shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{current.badgeText || 'OFFICIAL AGENCY SPOTLIGHT'}</span>
                  </span>

                  {current.discountOrOffer && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-sm">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      <span>{current.discountOrOffer}</span>
                    </span>
                  )}

                  {current.aspectRatio && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-gray-400 border border-white/10 font-mono">
                      {current.aspectRatio} Ratio
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-[1.15]">
                  {current.headline || current.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-gray-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl text-balance">
                  {current.subtitle ||
                    'Secure verified celebrity showstoppers, playback vocalists, and runway supermodels backed by official contracts and guaranteed riders.'}
                </p>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-gray-300">
                  <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>Verified Riders</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Direct Agency SLA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Global Escort Team</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Indicator Dots */}
              <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => onOpenBooking(current.title, `Campaign Inquiry: ${current.title}`)}
                    className="btn-gold px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer hover:scale-105 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{current.primaryCtaLabel || 'Book This Campaign'}</span>
                  </button>

                  {current.secondaryCtaLabel && (
                    <button
                      onClick={() => {
                        if (onExploreCategory) onExploreCategory();
                        else onOpenBooking(current.title);
                      }}
                      className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{current.secondaryCtaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Pagination Dots */}
                {publishedBanners.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 self-center">
                    {publishedBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setProgress(0);
                          setActiveIdx(idx);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeIdx === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-gray-600 hover:bg-gray-400'
                        }`}
                        title={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Custom Media Image with Aspect Ratio Frame */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-gradient-to-br from-[#1C0912] via-[#100C16] to-[#0A090E] flex items-center justify-center p-4 sm:p-6">
              {hasCustomMedia ? (
                <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700 flex items-center justify-center">
                  <img
                    src={current.imageUrl}
                    alt={current.title}
                    onError={() =>
                      setImgErrors((prev) => ({
                        ...prev,
                        [current.id || `${activeIdx}`]: true
                      }))
                    }
                    className="w-full h-full object-cover object-center filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center relative z-10 select-none py-10">
                  <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />
                  <div className="w-24 h-24 rounded-2xl border-2 border-[#D4AF37]/60 bg-black/60 flex flex-col items-center justify-center shadow-2xl shadow-[#D4AF37]/30 group-hover:scale-105 transition-transform">
                    <Crown className="w-10 h-10 text-[#D4AF37] mb-1" />
                    <span className="text-[9px] font-cinzel font-bold text-[#F3D068] tracking-widest uppercase">
                      OFFICIAL VIP
                    </span>
                  </div>
                  <h4 className="font-cinzel text-base font-bold text-white mt-4 max-w-xs">
                    {current.title}
                  </h4>
                  <span className="text-xs text-[#D4AF37] font-mono mt-1 uppercase tracking-wider">
                    {current.badgeText || 'SPECIAL SEASON'}
                  </span>
                </div>
              )}

              {/* Overlay Tag in Corner */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-cinzel font-bold z-10">
                AVA EXECUTIVE ALLIANCE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
