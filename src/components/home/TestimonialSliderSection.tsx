import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Testimonial, TestimonialAuthorType } from '../../types';
import { DEFAULT_TESTIMONIALS } from '../../data/defaultTestimonials';
import { getLiveTestimonials, submitRealReview } from '../../services/dbService';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  Users,
  Award,
  Play,
  Pause,
  ArrowRight,
  CalendarCheck,
  X,
  Send,
  MessageSquarePlus
} from 'lucide-react';

interface TestimonialSliderSectionProps {
  testimonials?: Testimonial[];
  onOpenBooking?: () => void;
  onOpenJoinTalent?: () => void;
}

export const TestimonialSliderSection: React.FC<TestimonialSliderSectionProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  onOpenBooking,
  onOpenJoinTalent,
}) => {
  const [filter, setFilter] = useState<'all' | TestimonialAuthorType>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(testimonials);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Review modal state for real live reviews
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    organization: '',
    authorType: 'client' as 'client' | 'artist',
    category: 'Celebrity Booking & Events',
    city: 'Mumbai',
    rating: 5,
    quote: '',
    projectOutcome: '',
  });

  // Load real live testimonials from Firestore & localStorage
  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const liveList = await getLiveTestimonials();
        if (isMounted && liveList.length > 0) {
          // Merge real live testimonials first, followed by default editorial items
          const liveIds = new Set(liveList.map((t) => t.id));
          const remainingDefaults = DEFAULT_TESTIMONIALS.filter((t) => !liveIds.has(t.id));
          setAllTestimonials([...liveList, ...remainingDefaults]);
        }
      } catch (err) {
        console.warn('Could not load live testimonials:', err);
      }
    }
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    if (filter === 'all') return allTestimonials;
    return allTestimonials.filter((t) => t.authorType === filter);
  }, [allTestimonials, filter]);

  // Ensure index remains in bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying && !isHovered && filteredTestimonials.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, filteredTestimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % filteredTestimonials.length
    );
  };

  const handleFormSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.quote.trim()) return;

    setSubmittingReview(true);
    try {
      const newId = await submitRealReview({
        name: reviewForm.name.trim(),
        title: reviewForm.organization.trim() ? `${reviewForm.organization.trim()} Executive` : undefined,
        organization: reviewForm.organization.trim() || undefined,
        authorType: reviewForm.authorType,
        category: reviewForm.category,
        city: reviewForm.city,
        rating: reviewForm.rating,
        quote: reviewForm.quote.trim(),
        projectOutcome: reviewForm.projectOutcome.trim() || undefined,
      });

      const newLiveTestimonial: Testimonial = {
        id: newId,
        name: reviewForm.name.trim(),
        title: reviewForm.organization.trim() ? `${reviewForm.organization.trim()} Executive` : 'Verified Client',
        organization: reviewForm.organization.trim() || undefined,
        authorType: reviewForm.authorType,
        category: reviewForm.category,
        city: reviewForm.city,
        rating: reviewForm.rating,
        quote: reviewForm.quote.trim(),
        projectOutcome: reviewForm.projectOutcome.trim() || undefined,
        isRealRating: true,
        isLiveRating: true,
        isFeatured: true,
        verifiedBadge: 'Verified Live Rating',
        date: 'Just Now',
      };

      setAllTestimonials((prev) => [newLiveTestimonial, ...prev]);
      setReviewSubmittedSuccess(true);
      setTimeout(() => {
        setReviewSubmittedSuccess(false);
        setReviewModalOpen(false);
        setReviewForm({
          name: '',
          organization: '',
          authorType: 'client',
          category: 'Celebrity Booking & Events',
          city: 'Mumbai',
          rating: 5,
          quote: '',
          projectOutcome: '',
        });
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const currentTestimonial = filteredTestimonials[currentIndex] || filteredTestimonials[0];

  if (!currentTestimonial) return null;

  // Helper for author initials monogram badge
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section
      id="testimonials-section"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/20 bg-[#07070A] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cinematic Luxury Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#8B1E2D]/15 via-[#D4AF37]/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3D068] text-xs font-cinzel font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Proven Prestige & Success Stories</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Voices of <span className="text-gold-gradient">Celebrity Artists & Elite Clients</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
              Real endorsements from India’s leading film producers, corporate festival heads, and marquee performers represented exclusively by AVA Celebrity Management.
            </p>
          </div>

          {/* Action & Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
            {/* Live Review Button */}
            <button
              onClick={() => setReviewModalOpen(true)}
              className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105"
              title="Submit a genuine verified live review & rating"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-black" />
              <span>Submit Live Review (थेट रिव्ह्यू द्या)</span>
            </button>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#101016] p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All Stories ({allTestimonials.length})
              </button>
              <button
                onClick={() => setFilter('artist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filter === 'artist'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Artists</span>
              </button>
              <button
                onClick={() => setFilter('client')}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filter === 'client'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Clients</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Showcase Slider Card */}
        <div className="card-luxury rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border-gold-glow relative bg-[#0C0C12]/90 shadow-2xl backdrop-blur-xl">
          {/* Top Card Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Glowing Quote Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#250811] to-[#161208] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/15">
                <Quote className="w-6 h-6 rotate-180" />
              </div>

              <div>
                {/* STRICT REAL-ONLY RATING: Only rendered if this is genuinely a live rated story. Zero demo rating shown! */}
                {currentTestimonial.isRealRating && currentTestimonial.rating && currentTestimonial.rating > 0 ? (
                  <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                    {[...Array(Math.min(5, Math.max(1, Math.round(currentTestimonial.rating))))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                    ))}
                    <span className="text-[11px] font-mono text-emerald-400 ml-1.5 font-bold">
                      {currentTestimonial.rating.toFixed(1)} / 5.0 • Live Verified Rating
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-cinzel font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      currentTestimonial.authorType === 'artist'
                        ? 'bg-[#8B1E2D]/25 text-rose-300 border-[#8B1E2D]/60'
                        : 'bg-[#D4AF37]/20 text-[#F3D068] border-[#D4AF37]/50'
                    }`}
                  >
                    {currentTestimonial.authorType === 'artist' ? 'Exclusive Celebrity Story' : 'Corporate Client Review'}
                  </span>
                  <span className="text-gray-400 text-xs hidden sm:inline">•</span>
                  <span className="text-gray-300 text-xs hidden sm:inline font-medium">
                    {currentTestimonial.category}
                  </span>
                  {currentTestimonial.isRealRating && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      ✓ Real Live Feedback
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Slide Index Counter & Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Story <span className="text-[#F3D068] font-bold">{currentIndex + 1}</span> of{' '}
                {filteredTestimonials.length}
              </span>

              {/* Autoplay Pause/Play button */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition cursor-pointer"
                title={isAutoPlaying ? 'Pause automatic slider' : 'Resume automatic slider'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </button>
            </div>
          </div>

          {/* Testimonial Quote Body */}
          <div className="py-8 sm:py-10">
            <p className="font-serif italic text-lg sm:text-2xl lg:text-3xl text-gray-100 leading-relaxed font-light">
              "{currentTestimonial.quote}"
            </p>

            {/* Impact / Milestone Pill */}
            {currentTestimonial.projectOutcome && (
              <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#F3D068]">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-semibold tracking-wide">
                  Verified Outcome: {currentTestimonial.projectOutcome}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Card Footer: Author Profile & Navigation Arrows */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              {/* Monogram Badge */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1E2D] to-[#1E1208] border border-[#D4AF37]/60 flex items-center justify-center font-cinzel font-bold text-base text-[#F3D068] shadow-md shadow-[#D4AF37]/20">
                {getInitials(currentTestimonial.name)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-white">
                    {currentTestimonial.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{currentTestimonial.verifiedBadge || 'Verified'}</span>
                  </span>
                </div>
                <p className="text-gray-300 text-xs">
                  {currentTestimonial.title}
                  {currentTestimonial.organization && ` • ${currentTestimonial.organization}`}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{currentTestimonial.city}</span>
                  {currentTestimonial.date && (
                    <>
                      <span>•</span>
                      <span>{currentTestimonial.date}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Prev / Next Navigation Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrev}
                className="p-3 rounded-xl bg-[#14141E] hover:bg-[#D4AF37] text-gray-300 hover:text-black border border-white/10 hover:border-[#D4AF37] transition cursor-pointer shadow-md group"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-xl bg-[#14141E] hover:bg-[#D4AF37] text-gray-300 hover:text-black border border-white/10 hover:border-[#D4AF37] transition cursor-pointer shadow-md group"
                aria-label="Next story"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel Bar of Other Stories */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTestimonials.slice(0, 4).map((t) => {
            const isActive = filteredTestimonials[currentIndex]?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  const targetIdx = filteredTestimonials.findIndex((item) => item.id === t.id);
                  if (targetIdx !== -1) setCurrentIndex(targetIdx);
                }}
                className={`card-luxury rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-[#D4AF37] bg-[#14141E] shadow-lg shadow-[#D4AF37]/10 -translate-y-1'
                    : 'opacity-70 hover:opacity-100 hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {/* Real Live Rating vs Clean Category Pill (Zero Demo Rating) */}
                  {t.isRealRating && t.rating && t.rating > 0 ? (
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {[...Array(Math.min(5, Math.max(1, Math.round(t.rating))))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                      ))}
                      <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1">
                        {t.rating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-cinzel font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {t.authorType === 'artist' ? 'Verified Artist' : 'Verified Client'}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                    {t.city}
                  </span>
                </div>
                <p className="text-gray-300 text-xs line-clamp-2 italic mb-3">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <div className="w-6 h-6 rounded-md bg-[#250811] border border-[#D4AF37]/50 flex items-center justify-center text-[10px] font-cinzel font-bold text-[#F3D068]">
                    {getInitials(t.name)}
                  </div>
                  <div className="truncate">
                    <p className="text-white text-xs font-cinzel font-semibold truncate">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-[10px] truncate">{t.organization || t.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Booking / Application Callout Banner */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#1E060E] via-[#0E0E14] to-[#1E1708] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              Create Your Next Marquee Success Story
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
              Partner with India’s leading luxury talent management agency for verified artist bookings, arena tours, and premium brand alignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Marquee Talent</span>
              </button>
            )}

            {onOpenJoinTalent && (
              <button
                onClick={onOpenJoinTalent}
                className="px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold text-[#F3D068] hover:text-white bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 hover:border-[#D4AF37] transition flex items-center gap-2 cursor-pointer"
              >
                <span>Join AVA Talent Roster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Submitting Genuine Live Rating & Review */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="card-luxury w-full max-w-lg rounded-2xl border-gold-glow my-6 overflow-hidden bg-[#0C0C12] shadow-2xl relative">
            <div className="px-5 py-4 border-b border-[#D4AF37]/30 flex items-center justify-between bg-gradient-to-r from-[#1E0812] to-[#141208]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F3D068]" />
                <h3 className="font-cinzel text-base font-bold text-white">
                  Submit Genuine Review & Rating (थेट रिव्ह्यू द्या)
                </h3>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmittedSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-cinzel text-xl font-bold text-white">
                  Review Published Live!
                </h4>
                <p className="text-gray-300 text-xs">
                  Your live rating and feedback have been published directly to the AVA VIP Roster & Testimonials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmitReview} className="p-5 sm:p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Your Full Name / Organisation (नाव / कंपनी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="e.g. Sameer Kulkarni"
                    className="w-full bg-[#12121A] border border-white/15 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Organization / Brand Title
                    </label>
                    <input
                      type="text"
                      value={reviewForm.organization}
                      onChange={(e) => setReviewForm({ ...reviewForm, organization: e.target.value })}
                      placeholder="e.g. Pune Film Productions"
                      className="w-full bg-[#12121A] border border-white/15 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Maharashtra City (शहर)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.city}
                      onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                      placeholder="Mumbai / Pune / Nagpur"
                      className="w-full bg-[#12121A] border border-white/15 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Rating selection (1 to 5 stars) */}
                <div className="p-3.5 rounded-xl bg-[#14141E] border border-[#D4AF37]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 font-bold font-cinzel">Select Live Rating (रेटिंग निवडा):</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      {reviewForm.rating}.0 / 5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 cursor-pointer transition hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'text-[#F3D068] fill-[#F3D068]'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Your Experience Quote / Review (तुमचा अनुभव) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewForm.quote}
                    onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                    placeholder="Share your authentic experience with AVA artists, bookings, or production coordination..."
                    className="w-full bg-[#12121A] border border-white/15 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Project Outcome / Event Metric (पर्यायी)
                  </label>
                  <input
                    type="text"
                    value={reviewForm.projectOutcome}
                    onChange={(e) => setReviewForm({ ...reviewForm, projectOutcome: e.target.value })}
                    placeholder="e.g. 5,000 Attendees • Flawless Showstopper Execution"
                    className="w-full bg-[#12121A] border border-white/15 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-gold px-6 py-2 rounded-lg font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>{submittingReview ? 'Publishing...' : 'Publish Live Rating'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
