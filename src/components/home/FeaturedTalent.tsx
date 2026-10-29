import React from 'react';
import { TalentProfile } from '../../types';
import { Star, MapPin, Eye, CalendarCheck, Sparkles } from 'lucide-react';

interface FeaturedTalentProps {
  profiles: TalentProfile[];
  onViewProfile: (profile: TalentProfile) => void;
  onBookTalent: (profile: TalentProfile) => void;
  onExploreAll: () => void;
}

export const FeaturedTalent: React.FC<FeaturedTalentProps> = ({
  profiles,
  onViewProfile,
  onBookTalent,
  onExploreAll,
}) => {
  // Only approved, published and marked Featured by Admin!
  const featured = profiles.filter(
    (p) => p.status === 'published' && p.isFeatured
  );

  return (
    <section className="py-24 bg-[#0A0A0E] border-t border-white/5 relative overflow-hidden">
      {/* Subtle luxury glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#4A0512]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
              <span>Headlining Talent</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Featured <span className="text-gold-gradient">Celebrities & Artists</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
              Distinguished figures curated for high-profile film projects, global brand ambassadorships, and marquee appearances.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="text-xs text-[#D4AF37] hover:underline font-semibold tracking-wider uppercase flex items-center gap-1 self-start md:self-auto"
          >
            <span>View Complete Roster</span>
            <span>→</span>
          </button>
        </div>

        {/* Empty State when no featured profiles are published yet */}
        {featured.length === 0 ? (
          <div className="card-luxury rounded-2xl p-12 text-center max-w-2xl mx-auto border-gold-subtle">
            <Sparkles className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">
              No Featured Profiles Available Yet
            </h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed mb-6">
              Our exclusive talent roster is managed through our secure administrative portal. Featured profiles will appear here once approved and published by agency management.
            </p>
            <button
              onClick={onExploreAll}
              className="btn-burgundy px-6 py-2.5 rounded-md text-xs font-semibold"
            >
              Browse All Categories
            </button>
          </div>
        ) : (
          /* Featured Cards Grid */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {featured.map((item) => (
              <div
                key={item.id}
                className="group card-luxury rounded-2xl overflow-hidden flex flex-col justify-between border-gold-subtle hover:border-[#D4AF37] transition duration-300 shadow-xl"
              >
                {/* Photo & Badges */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181820]">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181822] to-[#0E0E14]">
                      <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-xl font-cinzel font-bold text-gold-gradient mb-2">
                        {item.name[0]}
                      </div>
                      <span className="font-cinzel text-xs text-gray-400">{item.name}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent opacity-85" />

                  {/* Badges Container */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-1.5 z-10">
                    <div className="flex items-center gap-1 flex-wrap">
                      <div className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[9px] sm:text-[10px] font-bold text-[#F3D068] flex items-center gap-1 font-cinzel">
                        <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                        <span className="hidden xs:inline">FEATURED</span>
                      </div>

                      {item.talentType && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-cinzel backdrop-blur shadow-sm border ${
                            item.talentType === 'Actress'
                              ? 'bg-pink-950/80 border-pink-500/60 text-pink-300'
                              : item.talentType === 'Actor'
                              ? 'bg-amber-950/80 border-amber-500/60 text-[#F3D068]'
                              : item.talentType === 'Influencer'
                              ? 'bg-purple-950/80 border-purple-500/60 text-purple-300'
                              : 'bg-white/15 border-white/20 text-white'
                          }`}
                        >
                          {item.talentType === 'Actress' && '👑 '}
                          {item.talentType === 'Actor' && '⭐ '}
                          {item.talentType === 'Influencer' && '📱 '}
                          {item.talentType}
                        </span>
                      )}
                    </div>

                    {item.availability && (
                      <div
                        className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold backdrop-blur-md shrink-0 ${
                          item.availability === 'Available'
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                            : 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                        }`}
                      >
                        {item.availability}
                      </div>
                    )}
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-cinzel font-semibold tracking-wider text-[#D4AF37] uppercase block truncate">
                        {item.categoryName || item.categorySlug}
                      </span>
                      {item.videoUrl && (
                        <span className="px-1.5 py-0.2 rounded bg-pink-950/80 border border-pink-500/40 text-[8px] font-mono font-bold text-pink-300 shrink-0">
                          🎬 {item.videoAspectRatio || '9:16'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-cinzel text-xs sm:text-lg font-bold text-white group-hover:text-gold-gradient transition leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    {item.city && (
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-300 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{item.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-2 leading-relaxed mb-3 sm:mb-4 hidden sm:block">
                    {item.bio || 'Represented exclusively by AVA Celebrity Management.'}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1 sm:pt-2 border-t border-white/10">
                    <button
                      onClick={() => onViewProfile(item)}
                      className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] sm:text-xs text-gray-200 font-medium transition flex items-center justify-center gap-1 border border-white/10 touch-press"
                    >
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => onBookTalent(item)}
                      className="btn-gold py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 touch-press"
                    >
                      <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
