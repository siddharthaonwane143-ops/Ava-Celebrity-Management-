import React, { useState } from 'react';
import { TalentProfile } from '../../types';
import { Video, Instagram, Youtube, Sparkles, MapPin, Eye, CalendarCheck } from 'lucide-react';

interface CreatorsGridProps {
  profiles: TalentProfile[];
  onViewProfile: (profile: TalentProfile) => void;
  onBookTalent: (profile: TalentProfile) => void;
}

export const CreatorsGrid: React.FC<CreatorsGridProps> = ({
  profiles,
  onViewProfile,
  onBookTalent,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('All');

  // Filter only published profiles categorized under influencers or content creators
  const creatorProfiles = profiles.filter(
    (p) =>
      p.status === 'published' &&
      (p.categorySlug === 'influencers' ||
        p.categorySlug === 'content-creators' ||
        p.creatorType)
  );

  const niches = [
    'All',
    'Instagram Creators',
    'YouTube Creators',
    'UGC Creators',
    'Reels Creators',
    'Fashion & Lifestyle',
    'Beauty & Makeup',
    'Entertainment',
    'Regional & Multilingual',
  ];

  const filteredCreators = creatorProfiles.filter((p) => {
    if (selectedNiche === 'All') return true;
    if (p.creatorType?.toLowerCase().includes(selectedNiche.toLowerCase())) return true;
    if (p.skills?.some(s => s.toLowerCase().includes(selectedNiche.toLowerCase()))) return true;
    return false;
  });

  return (
    <section className="py-24 bg-[#08080C] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>Digital Talent & Creators</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Influencers & <span className="text-gold-gradient">Content Creators</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
              Authentic storytellers and leading digital personalities across video, reels, beauty, and brand storytelling. Genuine verified rosters only.
            </p>
          </div>
        </div>

        {/* Niche Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {niches.map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedNiche === niche
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md'
                  : 'bg-[#121217] text-gray-400 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
              }`}
            >
              {niche}
            </button>
          ))}
        </div>

        {/* Creator Profiles Grid or Empty State */}
        {filteredCreators.length === 0 ? (
          <div className="card-luxury rounded-2xl p-12 text-center max-w-xl mx-auto border-gold-subtle">
            <Sparkles className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <h3 className="font-cinzel text-base font-bold text-white mb-2">
              No Creators Available in this Category Yet
            </h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
              We uphold strict authenticity standards and only display genuine profiles verified by agency administration. Check back soon or contact our VIP desk for custom talent discovery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredCreators.map((item) => (
              <div
                key={item.id}
                className="group card-luxury rounded-2xl overflow-hidden flex flex-col justify-between border-gold-subtle hover:border-[#D4AF37] transition duration-300 shadow-xl"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181820]">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#121217]">
                      <div className="w-14 h-14 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-lg font-cinzel font-bold text-gold-gradient mb-2">
                        {item.name[0]}
                      </div>
                      <span className="font-cinzel text-xs text-gray-400">{item.name}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent opacity-85" />

                  {item.creatorType && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 text-[9px] sm:text-[10px] font-semibold text-[#F3D068]">
                      {item.creatorType}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3">
                    <h3 className="font-cinzel text-xs sm:text-base font-bold text-white group-hover:text-gold-gradient transition leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    {item.socialHandle && (
                      <p className="text-[10px] sm:text-[11px] text-[#D4AF37] font-mono mt-0.5 truncate">
                        {item.socialHandle}
                      </p>
                    )}
                    {item.city && (
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-300 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{item.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-2 leading-relaxed mb-3 sm:mb-4 hidden sm:block">
                    {item.bio || 'Verified content creator represented by AVA.'}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1 sm:pt-2 border-t border-white/10">
                    <button
                      onClick={() => onViewProfile(item)}
                      className="py-1.5 sm:py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] sm:text-xs text-gray-200 font-medium transition flex items-center justify-center gap-1 border border-white/10 touch-press"
                    >
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => onBookTalent(item)}
                      className="btn-gold py-1.5 sm:py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 touch-press"
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
