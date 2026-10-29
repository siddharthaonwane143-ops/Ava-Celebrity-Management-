import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface FinalCtaProps {
  onExploreTalent: () => void;
  onBookCreator: () => void;
  onJoinAva: () => void;
  onExploreShows: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onExploreTalent,
  onBookCreator,
  onJoinAva,
  onExploreShows,
}) => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0E] via-[#14060C] to-[#060608] border-t border-[#D4AF37]/20 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-radial-gradient from-[#4A0512]/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 bg-[#1A1208] flex items-center justify-center mx-auto mb-6 text-[#D4AF37]">
          <Star className="w-6 h-6 fill-[#D4AF37]" />
        </div>

        <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
          Ready to Create an <span className="text-gold-gradient">Iconic Legacy</span>?
        </h2>

        <p className="text-gray-300 text-xs sm:text-base font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Whether you are an enterprise brand booking a marquee celebrity, a production company assembling film crew, or an exceptional talent seeking world-class representation.
        </p>

        {/* 4 Working Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <button
            onClick={onExploreTalent}
            className="btn-gold py-3 px-3 sm:px-4 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 touch-press"
          >
            <span>FIND TALENT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onBookCreator}
            className="btn-burgundy py-3 px-3 sm:px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 touch-press"
          >
            <span>BOOK CREATOR</span>
          </button>

          <button
            onClick={onJoinAva}
            className="bg-[#181822] hover:bg-[#20202E] border border-gold-subtle hover:border-[#D4AF37] text-gray-200 py-3 px-3 sm:px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition touch-press"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>JOIN AVA</span>
          </button>

          <button
            onClick={onExploreShows}
            className="bg-[#181822] hover:bg-[#20202E] border border-gold-subtle hover:border-[#D4AF37] text-gray-200 py-3 px-3 sm:px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition touch-press"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>EXPLORE SHOWS</span>
          </button>
        </div>
      </div>
    </section>
  );
};
