import React from 'react';
import { Award, Crown, Film, Building2, Sparkles, Star } from 'lucide-react';

interface BrandEmblemProps {
  name: string;
  tier?: string;
  className?: string;
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({ name, tier, className = 'w-full h-24' }) => {
  const normalized = name.toLowerCase();

  // Rolex Official Luxury Crest
  if (normalized.includes('rolex')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#141410] to-[#0A0A08] border border-[#D4AF37]/40 rounded-xl p-3 ${className}`}>
        <svg viewBox="0 0 100 45" className="w-16 h-8 text-[#D4AF37] fill-current">
          {/* Rolex Crown */}
          <path d="M50 8 L57 25 L68 14 L65 32 L35 32 L32 14 L43 25 Z" fill="#D4AF37" />
          <circle cx="50" cy="5" r="2.5" fill="#D4AF37" />
          <circle cx="68" cy="11" r="2.5" fill="#D4AF37" />
          <circle cx="32" cy="11" r="2.5" fill="#D4AF37" />
          <circle cx="60" cy="20" r="2" fill="#D4AF37" />
          <circle cx="40" cy="20" r="2" fill="#D4AF37" />
          <rect x="35" y="34" width="30" height="3" rx="1.5" fill="#D4AF37" />
        </svg>
        <span className="font-cinzel tracking-[0.25em] text-white font-bold text-xs mt-1">ROLEX</span>
        <span className="text-[8px] text-[#D4AF37] tracking-[0.2em] uppercase font-mono">Official Timekeeper</span>
      </div>
    );
  }

  // Mercedes-Benz Official Luxury Star
  if (normalized.includes('mercedes')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#121418] to-[#08090C] border border-slate-600/40 rounded-xl p-3 ${className}`}>
        <svg viewBox="0 0 100 50" className="w-14 h-8 text-slate-200 stroke-current" fill="none">
          <circle cx="50" cy="25" r="20" strokeWidth="2.5" stroke="#E2E8F0" />
          <path d="M50 7 L50 25 L34 35 M50 25 L66 35" strokeWidth="2.5" stroke="#E2E8F0" strokeLinecap="round" />
        </svg>
        <span className="font-cinzel tracking-[0.2em] text-white font-bold text-xs mt-1">MERCEDES-BENZ</span>
        <span className="text-[8px] text-slate-400 tracking-[0.15em] uppercase font-mono">VIP Escort Fleet</span>
      </div>
    );
  }

  // Taj Hotels & Palaces Royal Crest
  if (normalized.includes('taj')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1208] to-[#0E0A04] border border-[#D4AF37]/50 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
          <Crown className="w-4 h-4" />
        </div>
        <span className="font-cinzel tracking-[0.25em] text-white font-bold text-xs">TAJ</span>
        <span className="text-[8px] text-[#F3D068] tracking-[0.15em] uppercase font-mono">Hotels & Palaces</span>
      </div>
    );
  }

  // Paramount Cine Units Official Production Crest
  if (normalized.includes('paramount') || normalized.includes('cine')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#160B12] to-[#0C060A] border border-rose-500/30 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-rose-400/50 flex items-center justify-center text-rose-300 mb-1">
          <Film className="w-4 h-4" />
        </div>
        <span className="font-cinzel tracking-[0.15em] text-white font-bold text-xs">PARAMOUNT</span>
        <span className="text-[8px] text-rose-300 tracking-[0.15em] uppercase font-mono">ARRI 8K Cine Units</span>
      </div>
    );
  }

  // Jio World Convention Centre BKC
  if (normalized.includes('jio') || normalized.includes('convention')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#10141D] to-[#080B12] border border-blue-500/30 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-blue-400/50 flex items-center justify-center text-blue-300 mb-1">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="font-cinzel tracking-[0.15em] text-white font-bold text-xs">JIO WORLD</span>
        <span className="text-[8px] text-blue-300 tracking-[0.15em] uppercase font-mono">Convention Centre BKC</span>
      </div>
    );
  }

  // Milan Couture Atelier
  if (normalized.includes('milan') || normalized.includes('couture')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1A0E15] to-[#0E060C] border border-[#D4AF37]/40 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-cinzel tracking-[0.2em] text-white font-bold text-xs">MILAN COUTURE</span>
        <span className="text-[8px] text-[#F3D068] tracking-[0.15em] uppercase font-mono">Haute Couture Atelier</span>
      </div>
    );
  }

  // Moët & Chandon Royal Celebration
  if (normalized.includes('moët') || normalized.includes('moet')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#181206] to-[#0C0803] border border-[#D4AF37]/50 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
          <Star className="w-4 h-4" />
        </div>
        <span className="font-cinzel tracking-[0.15em] text-white font-bold text-xs">MOËT & CHANDON</span>
        <span className="text-[8px] text-[#F3D068] tracking-[0.15em] uppercase font-mono">Champagne Épernay</span>
      </div>
    );
  }

  // JioHotstar / JioCinema OTT Network
  if (normalized.includes('jiohotstar') || normalized.includes('hotstar')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1528] to-[#050B14] border border-blue-500/40 rounded-xl p-3 ${className}`}>
        <div className="flex items-center gap-1 mb-1">
          <Film className="w-4 h-4 text-sky-400" />
          <Sparkles className="w-3.5 h-3.5 text-[#F3D068]" />
        </div>
        <span className="font-cinzel tracking-[0.18em] text-white font-extrabold text-xs">JIO HOTSTAR</span>
        <span className="text-[8px] text-sky-300 tracking-[0.15em] uppercase font-mono">OTT Streaming Partner</span>
      </div>
    );
  }

  // ZEE5 Entertainment Network
  if (normalized.includes('zee5') || normalized.includes('zee')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#200B22] to-[#0D040E] border border-purple-500/40 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-purple-400/50 flex items-center justify-center text-purple-300 mb-1">
          <span className="font-cinzel font-black text-sm text-[#F3D068]">Z5</span>
        </div>
        <span className="font-cinzel tracking-[0.18em] text-white font-extrabold text-xs">ZEE5 PREMIUM</span>
        <span className="text-[8px] text-purple-300 tracking-[0.15em] uppercase font-mono">Broadcast & Digital Media</span>
      </div>
    );
  }

  // Netflix India / International OTT
  if (normalized.includes('netflix')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#220B0D] to-[#0F0405] border border-red-500/40 rounded-xl p-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border border-red-500/60 flex items-center justify-center text-red-500 font-black text-base mb-1 font-sans">
          N
        </div>
        <span className="font-cinzel tracking-[0.2em] text-white font-extrabold text-xs">NETFLIX</span>
        <span className="text-[8px] text-red-300 tracking-[0.15em] uppercase font-mono">Global OTT Partner</span>
      </div>
    );
  }

  // Generic Elite Brand Insignia
  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#14141E] to-[#0A0A10] border border-[#D4AF37]/30 rounded-xl p-3 ${className}`}>
      <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mb-1">
        <Award className="w-4 h-4" />
      </div>
      <span className="font-cinzel tracking-[0.15em] text-white font-bold text-xs truncate max-w-[140px] text-center">
        {name.toUpperCase()}
      </span>
      {tier && (
        <span className="text-[8px] text-[#D4AF37] tracking-[0.15em] uppercase font-mono mt-0.5">
          {tier}
        </span>
      )}
    </div>
  );
};
