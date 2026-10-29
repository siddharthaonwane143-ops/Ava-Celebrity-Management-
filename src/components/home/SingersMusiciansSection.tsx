import React from 'react';
import { TalentProfile } from '../../types';
import {
  Mic2,
  Music,
  Radio,
  Sparkles,
  CalendarCheck,
  ArrowRight,
  Headphones,
  Volume2
} from 'lucide-react';
import { InstagramVerifiedBadge } from '../common/InstagramVerifiedBadge';

interface SingersMusiciansSectionProps {
  profiles: TalentProfile[];
  onViewProfile: (profile: TalentProfile) => void;
  onBookTalent: (profile: TalentProfile) => void;
  onExploreCategory: () => void;
}

export const SingersMusiciansSection: React.FC<SingersMusiciansSectionProps> = ({
  profiles,
  onViewProfile,
  onBookTalent,
  onExploreCategory
}) => {
  const musicianProfiles = profiles.filter(
    (p) =>
      p.status === 'published' &&
      (p.categorySlug === 'singers-musicians' ||
        p.categoryName.toLowerCase().includes('singer') ||
        p.categoryName.toLowerCase().includes('musician'))
  );

  if (musicianProfiles.length === 0) return null;

  return (
    <section id="singers-musicians" className="py-20 bg-gradient-to-b from-[#08080C] via-[#0D0B14] to-[#08080C] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Mic2 className="w-3.5 h-3.5" />
              <span>Concerts, Stadium Tours & Playback Royalty</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Singers & <span className="text-gold-gradient">Musicians Arena Roster</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-xl">
              Soulful Bollywood playback vocalists, stadium live bands, and fusion symphony collectives delivering unforgettable live sound and festival headline tours.
            </p>
          </div>

          <button
            onClick={onExploreCategory}
            className="self-start md:self-auto text-xs font-semibold text-[#D4AF37] hover:text-[#FFF3BF] flex items-center gap-1.5 transition group cursor-pointer"
          >
            <span>View All Musicians</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {musicianProfiles.map((talent) => (
            <div
              key={talent.id}
              onClick={() => onViewProfile(talent)}
              className="card-luxury rounded-2xl overflow-hidden flex flex-col justify-between border-gold-subtle hover:border-[#D4AF37] transition duration-300 shadow-xl group hover:-translate-y-1.5 cursor-pointer bg-[#0D0C14]"
            >
              {/* Photo & Sound Wave Animation */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#100F17]">
                <img
                  src={talent.photoUrl}
                  alt={talent.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700 filter brightness-[0.9]"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C14] via-transparent to-transparent pointer-events-none" />

                {/* Animated Audio Equalizer Visualizer Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-black/80 backdrop-blur-md border border-purple-500/40 text-purple-300 flex items-center gap-1.5 shadow-md">
                  <span className="flex items-center gap-0.5">
                    <span className="w-0.5 h-2.5 bg-purple-400 animate-pulse" />
                    <span className="w-0.5 h-3.5 bg-purple-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-purple-400 animate-pulse delay-150" />
                    <span className="w-0.5 h-3 bg-purple-400 animate-pulse delay-100" />
                  </span>
                  <span>PREMIER HEADLINER</span>
                </div>

                {/* Instagram Verified Badge */}
                {(talent.instagramHandle || talent.socialHandle) && (
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <InstagramVerifiedBadge
                      handle={talent.instagramHandle || talent.socialHandle}
                      url={talent.instagramUrl}
                      followers={talent.instagramFollowers}
                      isVerified={talent.instagramVerified ?? true}
                    />
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-cinzel text-[#D4AF37] uppercase tracking-wider font-semibold">
                      {talent.subcategory || 'Playback Artist'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 font-semibold">
                      {talent.availability}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-2 leading-tight group-hover:text-[#F3D068] transition">
                    {talent.name}
                  </h3>

                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4 font-light">
                    {talent.bio}
                  </p>

                  {/* Skills / Genres */}
                  {talent.skills && talent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {talent.skills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#141420] border border-white/5 text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(talent);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 font-medium transition border border-white/10 text-center cursor-pointer"
                  >
                    View Repertoire
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookTalent(talent);
                    }}
                    className="btn-gold py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Book Concert</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
