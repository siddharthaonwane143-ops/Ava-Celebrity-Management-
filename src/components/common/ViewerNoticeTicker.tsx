import React from 'react';
import { Sparkles, AlertCircle, Bell, ChevronRight, X } from 'lucide-react';
import { ViewerFeatureCustomization } from '../../types';

interface ViewerNoticeTickerProps {
  features?: ViewerFeatureCustomization;
  onOpenBooking?: () => void;
}

export const ViewerNoticeTicker: React.FC<ViewerNoticeTickerProps> = ({
  features,
  onOpenBooking,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (!features?.enableNoticeTicker || dismissed) return null;

  const text = features.noticeTickerText || 'मराठी सिनेसृष्टी व बॉलीवूडचे नामवंत सेलिब्रिटी थेट बुकिंगसाठी उपलब्ध! • 100% Verified Talents & Official Digital Passes';
  const badge = features.noticeTickerBadge || 'VIP ANNOUNCEMENT';
  const theme = features.noticeTickerTheme || 'gold';
  const link = features.noticeTickerLink;

  const themeStyles = {
    gold: {
      bar: 'bg-gradient-to-r from-[#1C1405] via-[#2A1D07] to-[#1C1405] border-b border-[#D4AF37]/40 text-[#F9E29D]',
      badge: 'bg-[#D4AF37] text-black font-extrabold',
      icon: 'text-[#D4AF37]',
      shimmer: 'from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0'
    },
    crimson: {
      bar: 'bg-gradient-to-r from-[#2B090E] via-[#450C15] to-[#2B090E] border-b border-rose-500/40 text-rose-100',
      badge: 'bg-rose-500 text-white font-extrabold',
      icon: 'text-rose-400',
      shimmer: 'from-rose-500/0 via-rose-500/20 to-rose-500/0'
    },
    violet: {
      bar: 'bg-gradient-to-r from-[#160B24] via-[#24113B] to-[#160B24] border-b border-purple-500/40 text-purple-100',
      badge: 'bg-purple-600 text-white font-extrabold',
      icon: 'text-purple-400',
      shimmer: 'from-purple-500/0 via-purple-500/20 to-purple-500/0'
    },
    emerald: {
      bar: 'bg-gradient-to-r from-[#061F14] via-[#0A2E1F] to-[#061F14] border-b border-emerald-500/40 text-emerald-100',
      badge: 'bg-emerald-500 text-black font-extrabold',
      icon: 'text-emerald-400',
      shimmer: 'from-emerald-500/0 via-emerald-500/20 to-emerald-500/0'
    }
  }[theme];

  const handleClick = () => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else if (link === 'booking' && onOpenBooking) {
        onOpenBooking();
      }
    }
  };

  return (
    <div
      role="region"
      aria-label="Official Live Announcement"
      className={`relative z-40 w-full overflow-hidden px-3 py-2 text-xs transition-all duration-300 shadow-md ${themeStyles.bar} ${link ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm ${themeStyles.badge}`}>
            <Sparkles className="w-3 h-3" />
            <span>{badge}</span>
          </span>
        </div>

        {/* Center Marquee Content */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div className="animate-marquee whitespace-nowrap inline-block text-[11px] sm:text-xs font-medium tracking-wide">
            <span className="mx-4">{text}</span>
            <span className="mx-4 opacity-50">•</span>
            <span className="mx-4">{text}</span>
            <span className="mx-4 opacity-50">•</span>
            <span className="mx-4">{text}</span>
          </div>
        </div>

        {/* Right Action / Close */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {link && (
            <button
              onClick={handleClick}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] underline font-semibold hover:opacity-80 transition cursor-pointer"
            >
              <span>Explore</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
            className="p-1 rounded hover:bg-black/20 text-current/70 hover:text-current transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
