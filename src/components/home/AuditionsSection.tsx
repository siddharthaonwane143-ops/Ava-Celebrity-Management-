import React from 'react';
import { Audition } from '../../types';
import { Sparkles, Clapperboard, Calendar, MapPin, Send } from 'lucide-react';

interface AuditionsSectionProps {
  auditions: Audition[];
  onApplyAudition: (audition: Audition) => void;
}

export const AuditionsSection: React.FC<AuditionsSectionProps> = ({
  auditions,
  onApplyAudition,
}) => {
  const publishedAuditions = auditions.filter((a) => a.isPublished);

  return (
    <section className="py-24 bg-[#0A0A0E] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Casting & Roles</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Auditions & <span className="text-gold-gradient">Casting Calls</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
              Verified casting notices for major feature films, streaming series, international runways, and commercial campaigns.
            </p>
          </div>
        </div>

        {publishedAuditions.length === 0 ? (
          <div className="card-luxury rounded-2xl p-12 text-center max-w-xl mx-auto border-gold-subtle">
            <Sparkles className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <h3 className="font-cinzel text-base font-bold text-white mb-2">
              No Active Auditions Currently
            </h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
              Casting notices are published by certified production partners and casting directors. Check back regularly or submit your profile via our talent registration desk.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedAuditions.map((audition) => {
              const isClosed = audition.status === 'Closed';
              return (
                <div
                  key={audition.id}
                  className="card-luxury rounded-xl p-6 border-gold-subtle hover:border-[#D4AF37] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-cinzel font-semibold bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/30 uppercase">
                        {audition.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          audition.status === 'Open'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : audition.status === 'Closing Soon'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {audition.status}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-white mb-2">
                      {audition.projectTitle}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">
                      {audition.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-gray-300 bg-[#121217] p-3 rounded-lg border border-white/5 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Method: {audition.auditionMethod} {audition.location ? `(${audition.location})` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Deadline: {audition.deadline}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        <strong>Required:</strong> {audition.requiredMaterials}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      Eligible: {audition.eligibility}
                    </span>
                    <button
                      onClick={() => onApplyAudition(audition)}
                      disabled={isClosed}
                      className="btn-gold py-2 px-4 rounded text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Send className="w-3 h-3" />
                      <span>Apply Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
