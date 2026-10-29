import React from 'react';

interface AvaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'horizontal' | 'stacked';
  logoUrl?: string;
}

export const AvaLogo: React.FC<AvaLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  variant = 'horizontal',
  logoUrl,
}) => {
  const activeLogoUrl = logoUrl || (typeof window !== 'undefined' ? localStorage.getItem('ava_logo_url') : null);

  const sizeMap = {
    sm: {
      ava: 'text-xl tracking-wider',
      sub: 'text-[8px] tracking-[0.28em]',
      tagline: 'text-[9px]',
      gap: 'gap-0.5',
      img: 'w-7 h-7',
    },
    md: {
      ava: 'text-2xl sm:text-3xl tracking-widest',
      sub: 'text-[9px] sm:text-[10px] tracking-[0.32em]',
      tagline: 'text-xs',
      gap: 'gap-1',
      img: 'w-9 h-9 sm:w-10 sm:h-10',
    },
    lg: {
      ava: 'text-4xl sm:text-5xl tracking-widest',
      sub: 'text-xs sm:text-sm tracking-[0.38em]',
      tagline: 'text-xs',
      gap: 'gap-1.5',
      img: 'w-14 h-14 sm:w-16 sm:h-16',
    },
    xl: {
      ava: 'text-6xl sm:text-7xl tracking-widest',
      sub: 'text-sm sm:text-base tracking-[0.45em]',
      tagline: 'text-sm',
      gap: 'gap-2',
      img: 'w-20 h-20 sm:w-24 sm:h-24',
    },
  };

  const s = sizeMap[size];

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        {activeLogoUrl ? (
          <div className="relative mb-2 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md" />
            <img
              src={activeLogoUrl}
              alt="AVA Celebrity Management Logo"
              className={`${s.img} rounded-full object-cover border border-[#D4AF37]/60 shadow-lg relative z-10`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          </div>
        )}
        <span
          className={`font-cinzel font-bold leading-none ${s.ava}`}
          style={{
            background: 'linear-gradient(135deg, #FFF9DF 0%, #E8C86A 35%, #D4AF37 60%, #996D09 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 25px rgba(212, 175, 55, 0.25)',
          }}
        >
          AVA
        </span>
        <span
          className={`font-cinzel font-semibold uppercase text-gold-shimmer ${s.sub} ${s.gap} mt-1`}
          style={{
            color: '#E6C66E',
            letterSpacing: size === 'xl' ? '0.45em' : '0.35em',
          }}
        >
          CELEBRITY MANAGEMENT
        </span>
        {showTagline && (
          <span className={`text-gray-400 italic font-serif ${s.tagline} mt-2 text-gold-gradient`}>
            Building Stars. Creating Legacies.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {activeLogoUrl && (
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-sm" />
          <img
            src={activeLogoUrl}
            alt="AVA Logo"
            className={`${s.img} rounded-full object-cover border border-[#D4AF37]/70 shadow-md relative z-10`}
          />
        </div>
      )}
      <div className="flex flex-col">
        <span
          className={`font-cinzel font-bold leading-none ${s.ava}`}
          style={{
            background: 'linear-gradient(135deg, #FFF9DF 0%, #E8C86A 30%, #D4AF37 60%, #996D09 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.2))',
          }}
        >
          AVA
        </span>
        <span
          className={`font-cinzel font-semibold uppercase ${s.sub} mt-0.5`}
          style={{
            color: '#E2BF63',
          }}
        >
          CELEBRITY MANAGEMENT
        </span>
        {showTagline && (
          <span className={`text-gray-400 italic font-serif ${s.tagline} mt-1 text-gold-gradient`}>
            Building Stars. Creating Legacies.
          </span>
        )}
      </div>
    </div>
  );
};

