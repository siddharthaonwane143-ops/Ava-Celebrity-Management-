import React from 'react';
import {
  CalendarCheck,
  FileText,
  MapPin,
  ShieldCheck,
  Film,
  Mic,
  Sparkles,
  Play,
  Trophy,
  Clapperboard,
  Camera,
  Handshake,
  ArrowRight,
  Crown
} from 'lucide-react';

interface HomeFeaturesThreeLinesProps {
  onOpenBooking: (serviceType?: string) => void;
  onNavigate: (section: string, filterSlug?: string) => void;
  onScrollToVideos?: () => void;
  onScrollToPartners?: () => void;
}

export const HomeFeaturesThreeLines: React.FC<HomeFeaturesThreeLinesProps> = ({
  onOpenBooking,
  onNavigate,
  onScrollToVideos,
  onScrollToPartners,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-[#07070B] border-y border-white/5 relative overflow-hidden">
      {/* Subtle luxury ambient backlights */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#800A15]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3D068] text-xs font-cinzel font-bold uppercase tracking-widest mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AVA 3-Tier Command Hub • सर्व वैशिष्ट्ये ३ ओळीत</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-extrabold tracking-tight">
            Client Services & Talent Ecosystem in <span className="text-gold-gradient">3 Direct Lines</span>
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mt-2 font-light">
            Customer bookings, celebrity talent profiles with complete functions, and production media networks organized seamlessly.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* ============================================================== */}
          {/* LINE 1: CUSTOMER BOOKINGS & DIGITAL CONTRACT PASSES */}
          {/* ============================================================== */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#140F18]/90 via-[#0E0E14]/90 to-[#181208]/90 border border-[#D4AF37]/35 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black font-cinzel font-black text-xs flex items-center justify-center shadow-md">
                  1
                </span>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Line 1: Customer Booking Hub (ग्राहक बुकिंग व कंत्राट वैशिष्ट्ये)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono">
                      DIRECT ACTION
                    </span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-light block">
                    Zero customer accounts required • Instant legal dossier generation & Maharashtra venue scheduling
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking('Express VIP Appearance Booking')}
                className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-105 transition"
              >
                <span>Book Talent Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1.1 Direct Celebrity Appearance Booking */}
              <div
                onClick={() => onOpenBooking('Celebrity Appearance Booking')}
                className="card-luxury rounded-xl p-4 border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D068] transition-colors">
                    1-Click Celebrity Booking
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Book headline movie stars, playback vocalists, and creators with guaranteed date holds.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#D4AF37] font-semibold">Immediate Reservation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 1.2 Instant Digital Contract Dossier & PDF */}
              <div
                onClick={() => onOpenBooking('Instant Contract Pass')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-[#D4AF37] hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D068] transition-colors">
                    Official Contract & PDF Pass
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Automated 1-page full-cover dossier with QR verification, verified seal & director signature.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-sky-300 font-semibold">1-Page PDF Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 1.3 Maharashtra Cities Venue Coordination */}
              <div
                onClick={() => onOpenBooking('Maharashtra Venue Booking')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-[#D4AF37] hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D068] transition-colors">
                    Maharashtra City Selection
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Venues & shows across Mumbai, Pune, Nagpur, Nashik, Chhatrapati Sambhajinagar, Kolhapur.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-purple-300 font-semibold">36 Districts Active</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 1.4 VIP Security Escort & Convoy */}
              <div
                onClick={() => onOpenBooking('VIP Security & Convoy Protocol')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-[#D4AF37] hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D068] transition-colors">
                    VIP Security & Convoy Fleet
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Level-3 personal security officers, Mercedes motorcades, and green-room confidentiality.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-amber-300 font-semibold">Armored Escort</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* LINE 2: CELEBRITY & TALENT PROFILES (WITH ALL FUNCTIONS) */}
          {/* ============================================================== */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#170E10]/90 via-[#0E0E14]/90 to-[#12121D]/90 border border-purple-500/30 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-cinzel font-black text-xs flex items-center justify-center shadow-md">
                  2
                </span>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Line 2: Celebrity & Talent Profiles Hub (सेलिब्रिटी व टॅलेंट प्रोफाईल वैशिष्ट्ये)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 font-mono">
                      ALL FUNCTIONS ACTIVE
                    </span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-light block">
                    Verified Instagram metrics, 4K showreels, language filters, and real-time availability checks
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('talent')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold text-[#F3D068] bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 flex items-center gap-1.5 cursor-pointer shadow hover:border-[#D4AF37] transition"
              >
                <span>View Full Roster</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 2.1 Film & OTT Star Actors */}
              <div
                onClick={() => onNavigate('talent', 'actors')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-purple-400/60 hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                    <Film className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    Film & Web Series Actors
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    A-list cinema leads, OTT series stars, and theatre masters with verified acting bios and clips.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-purple-300 font-semibold">Filter Actors Roster</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2.2 Playback Singers & Musicians */}
              <div
                onClick={() => onNavigate('talent', 'singers')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-pink-400/60 hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-400/40 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-110 transition-transform">
                    <Mic className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                    Playback Singers & Bands
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Bollywood & Marathi chart-topping vocalists, classical instrumentalists, and live concert bands.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-pink-300 font-semibold">Filter Vocalists</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2.3 Runway Fashion Models */}
              <div
                onClick={() => onNavigate('talent', 'models')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-rose-400/60 hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-400/40 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                    Fashion Models & Anchors
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    International runway showstoppers, televised red carpet anchors, and brand ambassadors.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-rose-300 font-semibold">Filter Models</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2.4 4K Video Performance Reels */}
              <div
                onClick={() => {
                  if (onScrollToVideos) onScrollToVideos();
                  else onNavigate('home');
                }}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-[#D4AF37] hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D068] transition-colors">
                    4K Video Auditions & Reels
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Watch full-length monologues, concert solos, and dance performances uploaded directly by management.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#D4AF37] font-semibold">Watch Real Media</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* LINE 3: PRODUCTION, SHOWS & ALLIANCES */}
          {/* ============================================================== */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#0C151F]/90 via-[#0E0E14]/90 to-[#1A1408]/90 border border-sky-500/30 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-cinzel font-black text-xs flex items-center justify-center shadow-md">
                  3
                </span>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Line 3: Production, Shows & Official Alliances (प्रॉडक्शन, शोज व मीडिया)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40 font-mono">
                      LIVE ECOSYSTEM
                    </span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-light block">
                    Upcoming stadium galas, nationwide casting auditions, ARRI 8K units & auto-sliding sponsor network
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onScrollToPartners) onScrollToPartners();
                  else onNavigate('partners');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold text-sky-300 bg-white/5 hover:bg-white/10 border border-sky-500/40 flex items-center gap-1.5 cursor-pointer shadow hover:border-sky-400 transition"
              >
                <span>Explore Alliances</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 3.1 Executive Talent Booking & SLA */}
              <div
                onClick={() => onOpenBooking('Executive Talent Booking')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-sky-400/60 hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Executive Talent Booking
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Direct VIP booking with verified riders, binding agency contracts, and executive security escort.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-sky-300 font-semibold">Book Verified Celebrity</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3.2 Auditions & Casting Calls */}
              <div
                onClick={() => onNavigate('auditions')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-amber-400/60 hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                    <Clapperboard className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Auditions & Casting Calls
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Submit monologues and casting applications for web series, films, and international ads.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-amber-300 font-semibold">Apply for Casting</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3.3 ARRI 8K Cinematography & Drone Units */}
              <div
                onClick={() => onOpenBooking('Production & 8K Cinematography')}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-indigo-400/60 hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    8K Cine & Drone Units
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    Authorized ARRI camera packages, robotic crane rigs, and post-production Dolby Atmos suites.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-semibold">Book Production Gear</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3.4 Official Partners & Auto-Slide Sponsors */}
              <div
                onClick={() => {
                  if (onScrollToPartners) onScrollToPartners();
                  else onNavigate('partners');
                }}
                className="card-luxury rounded-xl p-4 border border-white/10 hover:border-[#D4AF37] hover:bg-[#1A1A24] transition-all cursor-pointer group shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D068] transition-colors">
                    Auto-Slide Partners & Sponsors
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-light">
                    JioHotstar, ZEE5, Rolex, Mercedes-Benz, Taj Hotels, and Milan Couture official alliances.
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#D4AF37] font-semibold">View Auto-Slide Logos</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
