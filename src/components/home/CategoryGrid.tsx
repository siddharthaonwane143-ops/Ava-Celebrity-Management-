import React from 'react';
import { TalentCategory, TalentProfile } from '../../types';
import { Users, ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryGridProps {
  categories: TalentCategory[];
  profiles: TalentProfile[];
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  profiles,
  onSelectCategory,
}) => {
  // Compute published profile counts strictly from database records
  const publishedProfiles = profiles.filter((p) => p.status === 'published');

  const countBySlug = publishedProfiles.reduce<Record<string, number>>((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] || 0) + 1;
    return acc;
  }, {});

  // If categories are empty in DB, display a refined empty state
  if (categories.length === 0) {
    return (
      <section className="py-20 bg-[#08080A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cinzel text-2xl sm:text-3xl text-gold-gradient font-bold mb-3">
            Explore Talent Directory
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
            Category structure is being initialized by agency management. No published categories available at this moment.
          </p>
          <div className="p-8 max-w-md mx-auto card-luxury rounded-xl border-gold-subtle">
            <Users className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <p className="text-gray-300 text-xs font-medium">
              Administrative portal is ready. Categories will appear as soon as published by the agency owner.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#08080C] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Disciplines & Divisions</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Explore Our <span className="text-gold-gradient">Talent Divisions</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
              Browse elite talent across cinema, television, runway fashion, live concerts, global brand endorsements, and digital content creation.
            </p>
          </div>

          <div className="text-xs text-gray-400">
            <span className="text-[#D4AF37] font-bold">{publishedProfiles.length}</span> Published Roster Profiles
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {categories.map((cat) => {
            const count = countBySlug[cat.slug] || 0;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#111116] border border-gold-subtle hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between p-4 sm:p-6 hover:-translate-y-1 shadow-lg touch-press"
              >
                {/* Image or gradient artwork background */}
                {cat.image ? (
                  <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-35 transition-opacity">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1C050B]/30 via-transparent to-[#1F180A]/30 group-hover:opacity-100 transition-opacity" />
                )}

                {/* Card Top */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#181820] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:bg-[#25180A] transition">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/50 transition">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="relative z-10 mt-6 sm:mt-12">
                  <h3 className="font-cinzel text-xs sm:text-lg font-bold text-white group-hover:text-gold-shimmer transition line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-2 mt-1 leading-relaxed font-light hidden sm:block">
                    {cat.description || 'Exclusive representation and booking for elite professionals.'}
                  </p>

                  <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px]">
                    <span className="text-gray-400">
                      <strong className="text-white font-mono">{count}</strong> {count === 1 ? 'star' : 'stars'}
                    </span>
                    <span className="text-gold-gradient font-medium group-hover:underline">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
