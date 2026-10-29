import React from 'react';
import { Instagram } from 'lucide-react';

interface InstagramVerifiedBadgeProps {
  handle?: string;
  url?: string;
  followers?: string;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InstagramVerifiedBadge: React.FC<InstagramVerifiedBadgeProps> = ({
  handle,
  url,
  followers,
  isVerified = true,
  size = 'md',
  className = '',
}) => {
  if (!handle && !url) return null;

  const displayHandle = handle
    ? handle.startsWith('@')
      ? handle
      : `@${handle}`
    : '@instagram';

  const href = url || `https://instagram.com/${displayHandle.replace('@', '')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#1E1128]/90 via-[#181120]/90 to-[#100D16]/90 border border-purple-500/30 hover:border-pink-500/60 text-white transition-all shadow-sm hover:shadow-pink-500/20 group select-none ${className}`}
      title={`Verified Instagram Profile: ${displayHandle}`}
    >
      {/* Instagram Gradient Icon */}
      <span className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#FF543E] via-[#FF007A] to-[#7B00FF] flex items-center justify-center text-white shrink-0 p-0.5 shadow-sm">
        <Instagram className="w-3 h-3" />
      </span>

      {/* Handle */}
      <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white transition font-mono truncate max-w-[130px]">
        {displayHandle}
      </span>

      {/* Real Instagram Verified Blue Badge */}
      {isVerified && (
        <span
          className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0095F6] text-white rounded-full shrink-0 shadow-sm"
          title="Verified Real Instagram Profile"
        >
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </span>
      )}

      {/* Followers Count */}
      {followers && (
        <span className="hidden sm:inline-block text-[10px] text-pink-300/90 font-medium pl-1 border-l border-white/10">
          {followers}
        </span>
      )}
    </a>
  );
};
